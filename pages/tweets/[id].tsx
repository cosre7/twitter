import { Tweet, User } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '../../lib/client/useMutation';
import SideBar from '../../components/sideBar';

interface TweetWithUser extends Tweet {
  user: User;
}

interface TweetDetailResponse {
  ok: boolean;
  tweet: TweetWithUser;
  isLiked: boolean;
}

export default function TweetDetail() {
  const router = useRouter();
  const { data, mutate } = useSWR<TweetDetailResponse>(router.query.id ? `/api/tweets/${router.query.id}` : null);
  const [toggleFav] = useMutation(`/api/tweets/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };
  console.log(data);
  return (
    <div>
      <SideBar />
      <h1>{data?.tweet?.content}</h1>
      <span>{data?.tweet?.user?.name}</span>
      <button onClick={onFavClick}>좋아요{data?.isLiked ? '❤️' : '🤍'}</button>
    </div>
  );
}
