// components/HowItWorks/QandA.tsx
'use client';
import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface QandAProps {
  faqs: FAQ[];
}

const QandA: React.FC<QandAProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-green-200 rounded-lg overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left bg-green-50 hover:bg-green-100 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-gray-900 text-lg">
              {faq.question}
            </span>
            <svg
              className={`w-5 h-5 text-green-600 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 py-4 bg-white">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QandA;