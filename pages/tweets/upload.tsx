import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';
import { useEffect } from 'react';
import SideBar from '../../components/sideBar';

interface UploadTweetForm {
  content: string;
}

export default function Upload() {
  const { register, handleSubmit } = useForm<UploadTweetForm>();
  const [uploadTweet, { data }] = useMutation('/api/tweets');
  const router = useRouter();
  const onValid = async (data: UploadTweetForm) => {
    uploadTweet(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/tweets/${data.tweet.id}`);
    }
  }, [data, router]);
  return (
    <div>
      <SideBar />
      <form
        onSubmit={handleSubmit(onValid)}
        className='flex flex-col justify-center px-10
      py-10'
      >
        <textarea
          placeholder='내용을 입력하세요'
          {...register('content', { required: true })}
          className='h-40 bg-purple-100 rounded-lg px-3 py-3 text-purple-600 placeholder:text-purple-400'
        ></textarea>
        <button className='mt-5 bg-purple-500 rounded-lg px-3 py-3 text-purple-300 font-bold text-lg'>twitt!</button>
      </form>
    </div>
  );
}
