'use client';

import React from 'react';
import { useResume } from '../context/ResumeContext';

export const EducationSection = () => {
  const { resumeData } = useResume();
  const { education } = resumeData;
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-1">Education</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-3" />
      
      {/* Education Items */}
      {education.map((edu, index) => (
        <div key={index} className="mb-4">
          {/* University and Date Row - Justified */}
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">
              {edu.universityName}
              {edu.universityMajor && (
                <span>, {edu.universityMajor}</span>
              )}
            </div>
            <div className="text-right">
              {edu.fromDate} – {edu.toDate}
            </div>
          </div>
          
          {/* Bullet Points */}
          <ul className="list-disc pl-5 space-y-1">
            {/* GPA if available */}
            {edu.gpa && (
              <li>
                GPA: {edu.gpa}
              </li>
            )}
            
            {/* Degree if available */}
            {edu.degree && (
              <li>
                {edu.degree}
              </li>
            )}
            
            {/* Courses if available */}
            {edu.courses && (
              <li>
                Coursework: {edu.courses}
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
