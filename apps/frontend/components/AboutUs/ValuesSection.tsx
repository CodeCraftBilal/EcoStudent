// components/AboutUs/ValuesSection.tsx
import React from 'react';
import { Shield, Users, Zap, Leaf, Heart, Target } from 'lucide-react';

const ValuesSection: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "We prioritize user safety with verified profiles, secure payments, and community ratings.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform thrives on community collaboration and mutual support among students.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage cutting-edge technology like AI to make exchanges smarter and easier.",
      color: "bg-purple-50 text-green-purple"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Every exchange contributes to reducing educational waste and environmental impact.",
      color: "bg-green-50 text-green-teal"
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "We believe quality education should be accessible to everyone, regardless of financial background.",
      color: "bg-pink-50 text-green-coral"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We're committed to delivering exceptional user experience and continuous improvement.",
      color: "bg-yellow-50 text-green-sun"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Core <span className="text-green-600">Values</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do at EcoStudent and shape our platform's development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                <value.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Built with Modern <span className="text-green-600">Technology</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-600 mb-2">Frontend</div>
              <div className="text-gray-700">Next.js, React, TypeScript, Tailwind CSS</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-600 mb-2">Backend</div>
              <div className="text-gray-700">Node.js, NestJS, PostgreSQL, Prisma</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-600 mb-2">AI/ML</div>
              <div className="text-gray-700">TensorFlow.js, HuggingFace, Image Recognition</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-600 mb-2">Services</div>
              <div className="text-gray-700">Google Maps, Socket.io, JazzCash, Easypaisa</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;