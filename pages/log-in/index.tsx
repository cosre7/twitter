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
  const onValid = (data: any) => {
    if (loading) return;
    logIn(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push('/');
    }
  }, [data, router]);
  const onCreateAccount = () => {
    router.push('/create-account');
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <label htmlFor='email'>Email : </label>
          <input type='email' id='email' {...register('email', { required: true })} />
          {errors?.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor='password'>Password : </label>
          <input type='password' id='password' {...register('password', { required: true })} />
          {errors?.password && <span>{errors.password.message}</span>}
        </div>
        <button>Login</button>
      </form>
      <Link href={'/create-account'}>
        <a>Create Account</a>
      </Link>
    </div>
  );
}
