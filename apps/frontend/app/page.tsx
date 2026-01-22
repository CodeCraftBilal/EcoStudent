'use client';

import Footer from '@/components/Footer';
import { Home } from '@/components/Home';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomePageContent() {
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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}