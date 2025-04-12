'use client';

import React, { createContext, useContext, useState } from 'react';

// Initial resume data
const initialResumeData = {
  userInfo: {
    firstName: "张",
    lastName: "三",
    headLine: "资深前端工程师",
    phoneNumber: "188-8008-8888",
    email: "zhangsan@example.com",
    linkedInURL: "linkedin.com/in/zhangsan",
    websiteOrOtherProfileURL: "zhangsan.dev",
    location: "北京, 中国",
    githubURL: "github.com/zhangsan"
  },
  education: [
    {
      universityName: "北京大学",
      universityLocation: "北京, 中国",
      universityMajor: "计算机科学与技术",
      degree: "本科学士",
      fromDate: "2018",
      toDate: "2022",
      gpa: "3.8/4.0",
      courses: "数据结构、算法设计、操作系统、计算机网络"
    }
  ],
  workExperience: [
    {
      companyName: "腾讯",
      jobTitle: "前端工程师",
      city: "深圳",
      country: "中国",
      fromDate: "2023-01",
      toDate: "",
      isPresent: true,
      description: "优化前端性能，页面加载速度提升30%"
    }
  ],
};

// Create context
const ResumeContext = createContext();

// Provider component
export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(initialResumeData);

  // Function to update a specific field in resumeData
  const updateResumeField = (path, value) => {
    setResumeData(prevData => {
      // Clone the previous data
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Handle dot notation path (e.g., 'userInfo.headLine')
      const keys = path.split('.');
      let current = newData;
      
      // Navigate to the nested object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          // Handle array access (e.g., 'education[0]')
          const arrayKey = key.substring(0, key.indexOf('['));
          const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
          current = current[arrayKey][index];
        } else {
          current = current[key];
        }
      }
      
      // Set the value at the final key
      const lastKey = keys[keys.length - 1];
      if (lastKey.includes('[') && lastKey.includes(']')) {
        const arrayKey = lastKey.substring(0, lastKey.indexOf('['));
        const index = parseInt(lastKey.substring(lastKey.indexOf('[') + 1, lastKey.indexOf(']')));
        current[arrayKey][index] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  // Simplified update function for common cases
  const updateTextContent = (blockId, plainText) => {
    switch (blockId) {
      case 'user-headline':
        updateResumeField('userInfo.headLine', plainText);
        break;
      case 'user-firstname':
        updateResumeField('userInfo.firstName', plainText);
        break;
      case 'user-lastname':
        updateResumeField('userInfo.lastName', plainText);
        break;
      case 'user-email':
        // Extract just the email if it contains other content
        const emailMatch = plainText.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
          updateResumeField('userInfo.email', emailMatch[0]);
        } else {
          updateResumeField('userInfo.email', plainText);
        }
        break;
      case 'user-phone':
        // Extract phone number if it contains other content
        const phoneMatch = plainText.match(/\d[\d\s-]{7,}/);
        if (phoneMatch) {
          updateResumeField('userInfo.phoneNumber', phoneMatch[0]);
        } else {
          updateResumeField('userInfo.phoneNumber', plainText);
        }
        break;
      // Add more cases as needed for other blocks
      default:
        console.log(`No mapping defined for block ID: ${blockId}`);
        break;
    }
  };

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeField, updateTextContent }}>
      {children}
    </ResumeContext.Provider>
  );
}

// Custom hook to use the resume context
export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
