'use client';

import React, { useState, useEffect } from 'react';
import { BlockContainer } from '../../components/editor/BlockContainer';
import { ResumeProvider, useResume } from '../../context/ResumeContext';

// Main content component that uses the resume context
function BlockContainerContent() {
  const [mounted, setMounted] = useState(false);
  const { resumeData, updateTextContent } = useResume();
  
  // When resumeData changes, update the templateBlocks
  const [templateBlocks, setTemplateBlocks] = useState([]);
  
  useEffect(() => {
    // Update template blocks when resumeData changes
    const newTemplateBlocks = [
      // 用户信息部分 - 使用 ${} 作为占位符
      {
        id: 'user-info',
        content: `<h1>${resumeData.userInfo.firstName}${resumeData.userInfo.lastName}</h1>`,
        type: 'heading',
        parentId: null
      },
      {
        id: 'user-headline',
        content: `<p><strong>${resumeData.userInfo.headLine}</strong></p>`,
        type: 'paragraph',
        parentId: 'user-info'
      },
      {
        id: 'user-email',
        content: `<p><strong>联系方式：</strong>电话: ${resumeData.userInfo.phoneNumber} | 邮箱: ${resumeData.userInfo.email}</p>`,
        type: 'paragraph',
        parentId: 'user-info'
      },
  
      // 教育经历部分 - 使用 ${} 作为占位符
      {
        id: 'education',
        content: '<h1>教育经历</h1>',
        type: 'heading',
        parentId: null
      },
      {
        id: 'three-column-edu1',
        type: 'three-column',
        parentId: 'education',
        content: [
          `<div>
            <p><strong>${resumeData.education[0].universityName}</strong></p>
            <p>${resumeData.education[0].universityLocation}</p>
          </div>`,
          `<div>
            <p><strong>${resumeData.education[0].universityMajor}</strong></p>
            <p>${resumeData.education[0].degree}</p>
          </div>`,
          `<div>
            <p><strong>${resumeData.education[0].fromDate}-${resumeData.education[0].toDate}</strong></p>
            <p>GPA: ${resumeData.education[0].gpa}</p>
            <p>相关课程：${resumeData.education[0].courses}</p>
          </div>`
        ]
      },
      
      // 工作经历部分 - 使用 ${} 作为占位符
      {
        id: 'work-experience',
        content: '<h1>工作经历</h1>',
        type: 'heading',
        parentId: null
      },
      {
        id: 'two-column-work1',
        type: 'two-column',
        parentId: 'work-experience',
        content: [
          `<div>
            <p><strong>${resumeData.workExperience[0].companyName}</strong></p>
            <p>${resumeData.workExperience[0].city}, ${resumeData.workExperience[0].country}</p>
            <p>${resumeData.workExperience[0].fromDate}-${resumeData.workExperience[0].isPresent ? '至今' : resumeData.workExperience[0].toDate}</p>
          </div>`,
          `<div>
            <p><strong>${resumeData.workExperience[0].jobTitle}</strong></p>
            <p>${resumeData.workExperience[0].description}</p>
          </div>`
        ]
      }
    ];
    
    setTemplateBlocks(newTemplateBlocks);
  }, [resumeData]);
  
  // Handle block content changes
  const handleBlocksChange = (newBlocks) => {
    setTemplateBlocks(newBlocks);
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <BlockContainer 
          blocks={templateBlocks} 
          onBlocksChange={handleBlocksChange} 
          onTextChange={updateTextContent}
        />
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">当前数据 (实时更新):</h3>
        <pre className="whitespace-pre-wrap overflow-auto">
          {JSON.stringify(resumeData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Wrapper component that provides the ResumeContext
export default function BlockContainerTest() {
  return (
    <ResumeProvider>
      <BlockContainerContent />
    </ResumeProvider>
  );
}
