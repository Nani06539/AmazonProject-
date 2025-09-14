import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import IdeasPage from '@/components/IdeasPage';

export default async function Ideas() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return <IdeasPage />;
}

