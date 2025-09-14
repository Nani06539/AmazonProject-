import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import VideoBrowsingPage from '@/components/VideoBrowsingPage';

export default async function Videos() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return <VideoBrowsingPage />;
}

