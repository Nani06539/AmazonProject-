import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    return <LandingPage />;
  }
  
  return <Dashboard />;
}
