'use client';

import React, { useState, useEffect } from 'react';
import { BlockContainer } from '../../components/editor/BlockContainer';
import TemplateBlockRenderer from '../../components/TemplateBlockRenderer';

export default function BlockContainerTest() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  
  // Make resumeData stateful
  const [resumeData, setResumeData] = useState({
    userInfo: {
      firstName: "张",
      lastName: "三",
      headLine: "资深前端工程师",
      phoneNumber: "188-8888-8888",
      email: "zhangsan@example.com",
      linkedInURL: "linkedin.com/in/zhangsan",
      websiteOrOtherProfileURL: "zhangsan.dev"
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
  });
  
  // Handle text changes from the editor blocks
  const handleTextChange = (blockId, plainText) => {
    console.log(`Text changed in block ${blockId}:`, plainText);
    
    // Update resumeData based on blockId
    switch (blockId) {
      case 'user-headline':
        setResumeData(prev => ({
          ...prev,
          userInfo: {
            ...prev.userInfo,
            headLine: plainText
          }
        }));
        console.log('Updated headLine:', plainText);
        break;
      // Add more cases for other blocks as needed
      default:
        // Do nothing for unrecognized block IDs
        break;
    }
  };

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
      <div className="mb-6 flex gap-4">
        <h1 className="text-2xl font-bold">简历编辑器</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded ${viewMode === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('edit')}
          >
            编辑模式
          </button>
          <button
            className={`px-4 py-1 rounded ${viewMode === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('preview')}
          >
            预览模式
          </button>
        </div>
      </div>
      
      {viewMode === 'edit' ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <BlockContainer 
            blocks={templateBlocks} 
            onBlocksChange={handleBlocksChange} 
            onTextChange={handleTextChange}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <TemplateBlockRenderer blocks={templateBlocks} />
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">当前数据 (实时更新):</h3>
        <pre className="whitespace-pre-wrap overflow-auto">
          {JSON.stringify(resumeData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
