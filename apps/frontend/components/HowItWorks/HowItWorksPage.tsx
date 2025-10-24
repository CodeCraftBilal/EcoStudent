// components/HowItWorks/HowItWorksPage.tsx
import React from 'react';
import StepCard from './StepCard';
import QandA from './QandA';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Sign Up & Create Profile",
      description: "Join our community in less than 2 minutes! Create your student profile with basic information.",
      icon: "👤",
      features: ["Quick registration", "Student verification", "Profile customization"]
    },
    {
      id: 2,
      title: "Explore Products",
      description: "Browse through books, uniforms, and educational materials in your area using our smart search.",
      icon: "🔍",
      features: ["Location-based results", "AI-powered search", "Filter by condition & price"]
    },
    {
      id: 3,
      title: "Upload Your Items",
      description: "List your unused books and uniforms. Our AI will automatically categorize them from photos!",
      icon: "📤",
      features: ["AI image recognition", "Easy listing process", "Multiple listing types"]
    },
    {
      id: 4,
      title: "Connect & Chat",
      description: "Message sellers/buyers directly with real-time text and voice chat features.",
      icon: "💬",
      features: ["Secure messaging", "Voice calls", "In-app notifications"]
    },
    {
      id: 5,
      title: "Secure Payments",
      description: "Choose between exchange, donation, or secure payment through JazzCash/Easypaisa.",
      icon: "💰",
      features: ["Multiple payment options", "Secure transactions", "Payment history"]
    },
    {
      id: 6,
      title: "Safe Meetup & Exchange",
      description: "Arrange meetups at safe, mutually agreed locations to complete your exchange.",
      icon: "🤝",
      features: ["Location sharing", "Safe meetup spots", "Rating system"]
    }
  ];

  const faqs = [
    {
      question: "Is EcoStudent completely free to use?",
      answer: "Yes! Basic features including listing, browsing, and messaging are completely free. We only charge minimal transaction fees for paid items to maintain the platform."
    },
    {
      question: "How does the AI image categorization work?",
      answer: "Simply upload a photo of your book or uniform, and our AI will automatically identify the item, suggest categories, and even estimate the condition to make listing easier!"
    },
    {
      question: "Is it safe to meet with strangers for exchanges?",
      answer: "We recommend choosing public, well-lit locations for meetups. Our rating system helps identify trustworthy users, and you can always bring a friend along for added safety."
    },
    {
      question: "What payment methods are supported?",
      answer: "We integrate with JazzCash and Easypaisa for secure digital payments. You can also choose to exchange items without money or donate them to students in need."
    },
    {
      question: "Can I list items other than books and uniforms?",
      answer: "Currently, we focus on educational materials including books, uniforms, stationery, and educational tools. This helps maintain our mission of supporting affordable education."
    },
    {
      question: "How do I earn ratings on my profile?",
      answer: "After each successful transaction, both parties can rate their experience. Positive ratings build trust and make it easier to connect with other community members."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How <span className="text-green-600">EcoStudent</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students in creating a sustainable educational community. 
            Follow these simple steps to start saving money and helping the environment!
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              stepNumber={step.id}
              title={step.title}
              description={step.description}
              icon={step.icon}
              features={step.features}
            />
          ))}
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked <span className="text-green-blue-600">Questions</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <QandA faqs={faqs} />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Movement?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start exchanging, saving, and making education more sustainable today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Sign Up Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-500 hover:bg-opacity-10 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;