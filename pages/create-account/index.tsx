import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();
  const [error, setError] = useState<null | string>(null);
  const [createAccount, { loading, data }] = useMutation('/api/user/create-account');
  const onValid = (data: any) => {
    if (loading) return;
    createAccount(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push('/log-in');
    } else {
      setError(data?.error);
    }
  }, [data, router]);
  return (
    <div className='flex flex-col items-center h-screen w-screen mt-32'>
      <h1 className='text-[70px] login-shadow text-purple-300'>Create Account</h1>
      <form
        className='mt-5 border-4 rounded-lg border-purple-600 px-10 py-10 flex flex-col items-center'
        onSubmit={handleSubmit(onValid)}
      >
        <div className='flex gap-3 name w-full justify-between'>
          <label htmlFor='name'>Name : </label>
          <input
            type='text'
            id='name'
            {...register('name', {
              required: '필수값입니다.',
              minLength: { value: 3, message: '3글자 이상 작성해주세요.' }
            })}
            className='bg-purple-400 rounded-lg px-3'
          />
        </div>
        {errors?.name && <span className='text-rose-500 flex w-full justify-end px-5'>{errors.name.message}</span>}
        <div className='flex gap-3 name w-full justify-between mt-5'>
          <label htmlFor='email'>Email : </label>
          <input
            className='bg-purple-400 rounded-lg px-3'
            type='email'
            id='email'
            {...register('email', { required: '필수값입니다.' })}
          />
        </div>
        {errors?.email && <span className='text-rose-500 flex w-full justify-end px-5'>{errors.email.message}</span>}
        <div className='flex gap-3 name w-full justify-between mt-5'>
          <label htmlFor='password'>Password : </label>
          <input
            type='password'
            id='password'
            {...register('password', {
              required: '필수값입니다.',
              minLength: { value: 5, message: '5글자 이상 작성해주세요.' }
            })}
            className='bg-purple-400 rounded-lg px-3'
          />
        </div>
        {errors?.password && (
          <span className='text-rose-500 flex w-full justify-end px-5'>{errors.password.message}</span>
        )}
        <button className=' mt-10 bg-purple-400 text-purple-700 font-semibold py-3 rounded-lg flex w-[50%] justify-center items-center'>
          Create Account
        </button>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
}
