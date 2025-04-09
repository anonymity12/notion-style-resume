'use client';

import React, { useState, useEffect } from 'react';
import { BlockContainer } from '../../components/editor/BlockContainer';
import TemplateBlockRenderer from '../../components/TemplateBlockRenderer';

export default function BlockContainerTest() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  
  // Sample resume data - this would come from your API in a real app
  const resumeData = {
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
  };

  // Template blocks with placeholders
  const templateBlocks = [
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

  // 使用模板区块作为初始状态
  const [blocks, setBlocks] = useState(templateBlocks);

  // 客户端渲染保护
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理块数据变更
  const handleBlocksChange = (newBlocks) => {
    setBlocks(newBlocks);
    console.log('Blocks updated:', newBlocks);
  };

  // 切换编辑和预览模式
  const toggleViewMode = () => {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit');
  };

  // 防止服务器端渲染错误
  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <style jsx global>{`
        .resume-container {
          font-family: 'Garamond', 'Times New Roman', serif;
          line-height: 1.3;
        }
        .resume-container h1 {
          font-family: 'Garamond', 'Times New Roman', serif;
          font-weight: 600;
        }
        .resume-container p {
          margin: 2pt 0;
        }
        .columns-container {
          display: flex;
          gap: 16px;
        }
        .column {
          flex: 1;
        }
        .block-heading, .block-paragraph {
          margin-bottom: 12px;
        }
        .block-three-column, .block-two-column {
          margin-bottom: 20px;
        }
        @media print {
          .resume-container {
            padding: 10mm;
            font-size: 10pt;
            line-height: 1.2;
          }
          .resume-debug, .resume-controls {
            display: none;
          }
        }
      `}</style>
      
      <h1 className="text-2xl font-bold mb-6">简历模板系统演示</h1>
      
      <div className="resume-controls mb-4 flex gap-4">
        <button 
          onClick={toggleViewMode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {viewMode === 'edit' ? '预览模式' : '编辑模式'}
        </button>
      </div>
      
      <div className="bg-white border rounded-lg p-8 shadow resume-container">
        {viewMode === 'edit' ? (
          <BlockContainer 
            blocks={blocks} 
            onBlocksChange={handleBlocksChange}
          />
        ) : (
          <TemplateBlockRenderer blocks={blocks} data={resumeData} />
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg resume-debug">
        <h2 className="text-lg font-semibold mb-2">当前数据结构:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-medium mb-1">模板区块:</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(blocks, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-md font-medium mb-1">简历数据:</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
