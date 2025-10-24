// components/AboutUs/MissionSection.tsx
import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

const MissionSection: React.FC = () => {
  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make education accessible and sustainable by creating a circular economy for educational resources, reducing waste while helping students save money.",
      color: "text-green-600"
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "A world where no student struggles to afford learning materials, and educational resources are continuously reused, reducing environmental impact.",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      title: "Our Passion",
      description: "We believe in the power of community and technology to solve real-world problems faced by students every day.",
      color: "text-green-coral"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why We <span className="text-green-600">Exist</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We started EcoStudent to address the growing challenges in education accessibility and sustainability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${card.color} bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <card.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              EcoStudent was born in the computer labs of University of Mianwali, where four students witnessed firsthand the struggle many classmates faced in acquiring expensive textbooks and uniforms.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We noticed that while some students had spare books collecting dust, others couldn't afford basic educational materials. This inspired us to create a platform that bridges this gap through technology.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to serve thousands of students across Pakistan, helping them save money while contributing to environmental sustainability.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-8 text-gray-600">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-bold mb-4">The Problem We Solve</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>30% of students struggle to afford textbooks each semester</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Thousands of usable books go unused in storage every year</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Traditional book production has significant environmental costs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;