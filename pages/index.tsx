import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Tweet, User } from '@prisma/client';
import SideBar from '../components/sideBar';

interface ResultType {
  ok: boolean;
}

interface TweetWithCount extends Tweet {
  _count: {
    favs: number;
  };
  user: User;
}

interface TweetResponse {
  ok: boolean;
  tweets: TweetWithCount[];
}

export default function Home() {
  const router = useRouter();
  const { data: isLoggedIn } = useSWR<ResultType>('/api/user');
  const { data } = useSWR<TweetResponse>('/api/tweets');

  useEffect(() => {
    if (isLoggedIn && !isLoggedIn.ok) {
      router.replace('/log-in');
    }
  }, [isLoggedIn, router]);

  const dateToString = (date: Date): string => {
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
    <>
      <SideBar />
      <div>
        <Link href={'/tweets/upload'}>
          <a className='fixed bottom-5 right-5 flex justify-center items-center rounded-full h-[60px] w-[60px] bg-purple-500 text-3xl text-purple-300 font-bold'>
            +
          </a>
        </Link>
      </div>
      <div className='px-10 pt-5 flex flex-col gap-5'>
        {data?.tweets?.map((tweet) => (
          <div key={tweet.id} className='border border-purple-500 rounded-2xl px-5 py-5'>
            <Link href={`/tweets/${tweet.id}`}>
              <a>
                <div className='flex items-center gap-5'>
                  <span className='text-purple-800 text-lg font-bold bg-purple-400 px-3 py-2 rounded-full'>
                    {tweet.user.name}
                  </span>
                  <span className='text-purple-700 font-bold text-base'>{dateToString(tweet.createdAt)}</span>
                </div>
                <div className='pt-3 px-3 text-lg text-purple-800 font-medium'>
                  <p>{tweet.content}</p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
