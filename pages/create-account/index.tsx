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
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <label htmlFor='name'>Name : </label>
          <input
            type='text'
            id='name'
            {...register('name', {
              required: '필수값입니다.',
              minLength: { value: 3, message: '3글자 이상 작성해주세요.' }
            })}
          />
          {errors?.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor='email'>Email : </label>
          <input type='email' id='email' {...register('email', { required: '필수값입니다.' })} />
          {errors?.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor='password'>Password : </label>
          <input
            type='password'
            id='password'
            {...register('password', {
              required: '필수값입니다.',
              minLength: { value: 5, message: '5글자 이상 작성해주세요.' }
            })}
          />
          {errors?.password && <span>{errors.password.message}</span>}
        </div>
        <button>Create Account</button>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
}
