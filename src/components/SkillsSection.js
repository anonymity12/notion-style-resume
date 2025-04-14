'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';

export const SkillsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { skills } = resumeData;
  
  // 将技能数组转换为逗号分隔的字符串
  const [skillsText, setSkillsText] = useState(skills.join(', '));
  
  // 处理技能文本变更
  const handleSkillsChange = (e) => {
    const newText = e.target.value;
    setSkillsText(newText);
    
    // 将文本转换回数组并更新上下文
    const skillsArray = newText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
      
    updateResumeField('skills', skillsArray);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-1 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-0.5">Skills</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      
      {/* Skills Input */}
      <div className="bg-white hover:bg-gray-50 p-1 rounded-md">
        <textarea
          value={skillsText}
          onChange={handleSkillsChange}
          placeholder="输入技能，用逗号分隔（例如：前端开发, React.js, TypeScript）"
          className="w-full p-0.5 border-none focus:outline-none focus:ring-0 min-h-[35px] resize-y"
        />
      </div>
    </div>
  );
};

export default SkillsSection;
