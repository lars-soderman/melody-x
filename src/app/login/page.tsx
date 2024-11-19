import { LoginForm } from '@/components/auth/LoginForm';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getUser(false);
  console.log('🔍 Login Page: User check:', !!user);

  if (user) {
    console.log('🔍 Login Page: Redirecting to home');
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-4xl font-bold text-gray-800">melody-x</h1>
      <LoginForm />
    </div>
  );
}
