'use client';

import React from 'react';
import { ResumeProvider } from '../../context/ResumeContext';
import UserBasicInfoSection from '../../components/UserBasicInfoSection';
import EducationSection from '../../components/EducationSection';

export default function UserInfoDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeProvider>
        <div className="container mx-auto py-10 px-4">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-700">简历基本组件展示</h2>
          
          {/* Display the UserBasicInfoSection component */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">用户基本信息</h3>
            <UserBasicInfoSection />
          </div>
          
          {/* Display the EducationSection component */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">教育经历</h3>
            <EducationSection />
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>这些组件使用原生HTML标签渲染用户信息，遵循简历布局最佳实践</p>
          </div>
        </div>
      </ResumeProvider>
    </div>
  );
}
