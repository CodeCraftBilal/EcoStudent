'use client';

import Footer from '@/components/Footer';
import { Home } from '@/components/Home';
import { BACKEND_URL, FRONTEND_URL } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function HomePageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('mode')
  console.log(search); 

  useEffect(() => {
    const test = async () => {
      const res = await fetch(`/api/test`, {
        method: 'POST',
        body: JSON.stringify({
          backendUrl: BACKEND_URL
        })
      })

    }

    test();

  }, [])
  
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