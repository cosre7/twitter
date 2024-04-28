import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';
import { useEffect } from 'react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();
  const [logIn, { loading, data }] = useMutation('/api/user/log-in');
  const onValid = (validForm: FormData) => {
    if (loading) return;
    logIn(validForm);
  };
  console.log(data, loading);
  useEffect(() => {
    if (data?.ok) {
      router.replace('/');
    }
  }, [data, router]);
  return (
    <div className='flex flex-col items-center h-screen w-screen mt-32'>
      <h1 className='text-[70px] login-shadow text-purple-300'>Login</h1>
      <form
        className='mt-5 border-4 rounded-lg border-purple-600 px-10 py-10 flex flex-col'
        onSubmit={handleSubmit(onValid)}
      >
        <div className='flex gap-3 name w-full justify-between'>
          <label className='' htmlFor='email'>
            Email
          </label>
          <input
            className='bg-purple-400 rounded-lg px-3'
            type='email'
            id='email'
            {...register('email', { required: '이메일을 입력해주세요' })}
          />
        </div>
        {errors?.email && <span className='text-rose-500 flex w-full justify-end px-5'>{errors.email.message}</span>}
        <div className='flex gap-3 justify-between name mt-5'>
          <label className='' htmlFor='password'>
            Password
          </label>
          <input
            className='bg-purple-400 rounded-lg px-3'
            type='password'
            id='password'
            {...register('password', { required: '비밀번호를 입력해주세요' })}
          />
        </div>
        {errors?.password && (
          <span className='text-rose-500 flex w-full justify-end px-5'>{errors.password.message}</span>
        )}
        {}
        <div className='flex justify-between px-1 py-5 w-full items-center gap-10'>
          <Link href={'/create-account'} legacyBehavior>
            <a className='bg-purple-200 text-purple-700 font-semibold py-3 rounded-lg w-full flex items-center justify-center'>
              Create Account
            </a>
          </Link>
          <button className='bg-purple-400 text-purple-700 font-semibold py-3 rounded-lg flex w-full justify-center items-center'>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
