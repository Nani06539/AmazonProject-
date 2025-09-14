import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LibraryPage from '@/components/LibraryPage';

export default async function Library() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return <LibraryPage />;
}

