// components/AboutUs/TeamSection.tsx
import React from 'react';
import {TeamMemberCard} from './index';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Muhammad Bilal Khan",
      role: "Full Stack Developer",
      regNumber: "BCS-F22-M11",
      expertise: ["React.js", "Next.js", "Node.js", "Tailwind CSS"],
      description: "Leads the full-stack development and system architecture"
    },
    {
      name: "Muhammad Javed",
      role: "Frontend Developer",
      regNumber: "BCS-F22-M20",
      expertise: ["HTML/CSS", "React.js", "UI/UX"],
      description: "Focuses on creating responsive and intuitive user interfaces"
    },
    {
      name: "Hussain Farooq",
      role: "Frontend & UI/UX Designer",
      regNumber: "BCS-F22-M26",
      expertise: ["Figma", "React.js", "Tailwind CSS", "UI/UX Design"],
      description: "Designs beautiful user experiences and implements frontend components"
    },
    {
      name: "Muhammad Rashid Khan",
      role: "Frontend Developer",
      regNumber: "BCS-F22-M35",
      expertise: ["Frontend Development", "Web Technologies"],
      description: "Develops core frontend functionality and user interactions"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-green-600">Team</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A passionate group of computer science students from University of Mianwali dedicated to making education more accessible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              role={member.role}
              regNumber={member.regNumber}
              expertise={member.expertise}
              description={member.description}
            />
          ))}
        </div>

        {/* Advisor Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Supervisor</h3>
            <div className="w-20 h-20 bg-linear-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
              DR
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Dr. Eid-ur-Rehman</h4>
            <p className="text-green-600 font-medium mb-4">Project Supervisor & Mentor</p>
            <p className="text-gray-600">
              Department of Computer Science & IT, University of Mianwali
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;