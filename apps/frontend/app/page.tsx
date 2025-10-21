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

export default function HomePage() {
  
  return (
    <div>
      <Home />
    </div>
  );
}