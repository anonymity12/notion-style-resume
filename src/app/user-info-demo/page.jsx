'use client';

import React from 'react';
import { ResumeProvider } from '../../context/ResumeContext';
import UserBasicInfoSection from '../../components/UserBasicInfoSection';

export default function UserInfoDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeProvider>
        <div className="container mx-auto py-10 px-4">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-700">用户基本信息展示</h2>
          
          {/* Display the UserBasicInfoSection component */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <UserBasicInfoSection />
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>这个组件使用原生HTML标签渲染用户信息，居中显示在页面中</p>
          </div>
        </div>
      </ResumeProvider>
    </div>
  );
}
