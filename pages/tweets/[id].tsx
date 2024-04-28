import { Tweet, User } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '../../lib/client/useMutation';
import SideBar from '../../components/sideBar';

interface TweetWithUser extends Tweet {
  user: User;
  _count: {
    favs: number;
  };
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
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isLiked: !prev.isLiked,
          tweet: {
            ...prev?.tweet,
            _count: {
              favs: prev.isLiked ? prev.tweet._count.favs - 1 : prev.tweet._count.favs + 1
            }
          }
        },
      false
    );
    toggleFav({});
  };
  console.log(data);

  const dateToString = (date: Date | undefined): string => {
    if (!date) return '';
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금 전';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

    return `${start.toLocaleDateString()}`;
  };

  return (
    <div>
      <SideBar />
      <div className='border-2 border-purple-500 rounded-2xl px-5 py-5 mt-5 mx-5 relative'>
        <div className='flex items-center gap-5'>
          <span className='name'>{data?.tweet?.user?.name}</span>
          <span className='text-purple-700 font-bold text-base'>{dateToString(data?.tweet?.createdAt)}</span>
        </div>
        <div className='pt-3 px-3 text-lg text-purple-800 font-medium'>
          <p>{data?.tweet?.content}</p>
        </div>
        <button className='absolute top-5 right-5' onClick={onFavClick}>
          {data?.isLiked ? <span>❤️ {data?.tweet?._count?.favs}</span> : <span>🤍 {data?.tweet?._count?.favs}</span>}
        </button>
      </div>
    </div>
  );
}
