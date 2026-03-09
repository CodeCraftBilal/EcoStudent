// app/about-us/page.tsx
import { Metadata } from 'next';
import { AboutUsPage } from '@/components/AboutUs';

export const metadata: Metadata = {
  title: 'About Us | EcoStudent',
  description: 'Learn about EcoStudent, our mission, and how we are building a sustainable student community for exchanging books and uniforms.',
};

export default function AboutUs() {
  return <AboutUsPage />;
}