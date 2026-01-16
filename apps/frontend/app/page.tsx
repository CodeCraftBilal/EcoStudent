'use client';

import Footer from '@/components/Footer';
import { Home } from '@/components/Home';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('mode')
  console.log(search); 
  return (
    <div>
      <Home />
      <Footer />
    </div>
  );
}