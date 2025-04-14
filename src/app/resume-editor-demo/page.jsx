'use client';

import React from 'react';
import { ResumeProvider } from '../../context/ResumeContext';
import ResumeBlockContainer from '../../components/resumeEditor/ResumeBlockContainer';
import DataDisplay from '../../components/DataDisplay'; // Add this line

export default function ResumeEditorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <ResumeProvider>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8 text-center">可拖拽简历编辑器</h1>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">提示：将鼠标悬停在各部分上可以看到拖动手柄。点击并拖动手柄可以调整各部分的顺序。</p>
            </div>
            
            <ResumeBlockContainer />
          </div>
          
          {/* 显示当前 resumeData JSON 内容 */}
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">当前简历数据：</h3>
              <DataDisplay />
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>此演示展示了可拖拽排序的简历模块，包含用户信息和教育经历部分</p>
          </div>
        </div>
      </ResumeProvider>
    </div>
  );
}
