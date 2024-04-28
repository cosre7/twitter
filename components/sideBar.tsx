import Link from 'next/link';
import useMutation from '../lib/client/useMutation';
import { useRouter } from 'next/router';

interface ResultType {
  ok: boolean;
}

export default function SideBar() {
  const router = useRouter();
  const [logOut, { loading, data }] = useMutation<ResultType>('/api/user/log-out');

  const onLogOut = () => {
    if (loading) return;
    logOut(data);
    router.replace('/log-in');
  };

  return (
    <div className='flex justify-between py-5 px-5 bg-purple-400 items-center'>
      <div>
        <Link href={'/'} legacyBehavior>
          <a className='font-bold text-3xl text-purple-300 text-shadow'>Twitter</a>
        </Link>
      </div>
      <div>
        <button className='text-purple-300 bg-purple-500 px-3 py-1 rounded-lg' onClick={onLogOut}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
