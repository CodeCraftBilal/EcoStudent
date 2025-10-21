'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  MapPin, 
  MessageCircle, 
  Shield, 
  Leaf, 
  Search,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { div } from 'framer-motion/client';
import { Home } from '@/components/Home';
import { useSearchParams } from 'next/navigation';
import ShopPage from '@/components/shop';

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