// app/how-it-works/page.tsx
import { Metadata } from "next";
import React from "react";
import HowItWorksPage from "@/components/HowItWorks/HowItWorksPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'How It Works | EcoStudent',
  description: 'Discover how easy it is to buy, sell, exchange, or donate educational resources securely on EcoStudent.',
};

export default function HowItWorks() {
  return (
    <div>
      <HowItWorksPage />
      <Footer />
    </div>
  );
}
