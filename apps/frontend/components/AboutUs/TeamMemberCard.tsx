import React from 'react';
import { Code2, Palette, Cpu, Globe } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  role: string;
  regNumber: string;
  expertise: string[];
  description: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  regNumber,
  expertise,
  description
}) => {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'full stack developer':
        return <Cpu size={20} />;
      case 'frontend & ui/ux designer':
        return <Palette size={20} />;
      case 'frontend developer':
        return <Code2 size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-linear-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
          {getRoleIcon(role)}
          <span className="text-sm font-medium">{role}</span>
        </div>
        <p className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded-full inline-block">
          {regNumber}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
        {description}
      </p>

      {/* Expertise */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center">Expertise</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Courses Background */}
      <div className="mt-4 pt-4 border-t border-green-100">
        <p className="text-xs text-gray-500 text-center">
          Background in: Web Development, DBMS, OOAD, Software Engineering, AI
        </p>
      </div>
    </div>
  );
};

export default TeamMemberCard;