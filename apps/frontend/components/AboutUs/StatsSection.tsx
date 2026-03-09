import React from 'react';
import { Users, BookOpen, Recycle, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: "5,000+",
      label: "Active Students",
      color: "text-blue-600"
    },
    {
      icon: BookOpen,
      number: "12,000+",
      label: "Books Exchanged",
      color: "text-green-600"
    },
    {
      icon: Recycle,
      number: "₨ 8.5M+",
      label: "Student Savings",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Satisfaction Rate",
      color: "text-green-600"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-green-500 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Making a <span className="text-green-100">Real Impact</span>
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Our numbers tell the story of a growing community dedicated to sustainable education
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <stat.icon size={32} className={stat.color} />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Environmental Impact */}
        <div className="mt-16 bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-center mb-8">Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">15,000+</div>
              <div className="text-green-500">Trees Saved</div>
              <div className="text-sm text-green-500 mt-2">Through book recycling</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">200+ tons</div>
              <div className="text-green-500">CO2 Reduction</div>
              <div className="text-sm text-green-500 mt-2">From reduced production</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-green-500">Waste Reduction</div>
              <div className="text-sm text-green-500 mt-2">In educational materials</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;