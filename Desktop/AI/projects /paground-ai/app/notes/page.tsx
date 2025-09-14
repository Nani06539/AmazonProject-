import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NotesPage from '@/components/NotesPage';

export default async function Notes() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return <NotesPage />;
}

