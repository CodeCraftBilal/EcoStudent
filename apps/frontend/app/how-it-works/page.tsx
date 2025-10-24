// app/how-it-works/page.tsx
import React from 'react'
import HowItWorksPage from '@/components/HowItWorks/HowItWorksPage';
import Footer from '@/components/Footer';
import { div } from 'framer-motion/client';

export default function HowItWorks() {
  return ( 
    <div>

  <HowItWorksPage />
  <Footer />
    </div>
);
}