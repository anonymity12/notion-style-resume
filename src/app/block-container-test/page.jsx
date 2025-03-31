'use client';

import React, { useState, useEffect } from 'react';
import { BlockContainer } from '../../components/editor/BlockContainer';

export default function BlockContainerTest() {
  const [mounted, setMounted] = useState(false);
  
  // 示例数据 - 包含不同类型的块和嵌套结构
  const [blocks, setBlocks] = useState([
    // 个人信息部分
    {
      id: 'user-info',
      content: '<h1>天天</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'username',
      content: '<p><strong>籍贯：</strong>四川</p>',
      type: 'paragraph',
      parentId: 'user-info'
    },
    {
      id: 'user-email',
      content: '<p><strong>联系方式：</strong>电话: 188-8888-8888 | 邮箱: zhangsan@example.com</p>',
      type: 'paragraph',
      parentId: 'user-info'
    },

    // 教育经历部分
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
          <p><strong>北京大学</strong></p>
          <p>北京, 中国</p>
        </div>`,
        `<div>
          <p><strong>计算机科学与技术</strong></p>
          <p>本科学士</p>
        </div>`,
        `<div>
          <p><strong>2018-2022</strong></p>
          <p>GPA: 3.8/4.0</p>
          <p>相关课程：数据结构、算法设计、操作系统、计算机网络</p>
        </div>`
      ]
    },
    
    // 工作经历部分
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
          <p><strong>腾讯</strong></p>
          <p>深圳, 中国</p>
          <p>2023-至今</p>
        </div>`,
        `<div>
          <p><strong>前端工程师</strong></p>
          <p>负责微信小程序核心功能开发与优化</p>
          <p>优化前端性能，页面加载速度提升30%</p>
        </div>`
      ]
    }
  ]);

  // 客户端渲染保护
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理块数据变更
  const handleBlocksChange = (newBlocks) => {
    setBlocks(newBlocks);
    console.log('Blocks updated:', newBlocks);
  };

  // 防止服务器端渲染错误
  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      
      
      <div className="bg-white border rounded-lg p-8 shadow">
        <BlockContainer 
          blocks={blocks} 
          onBlocksChange={handleBlocksChange}
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">当前数据结构:</h2>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(blocks, null, 2)}
        </pre>
      </div>
      <h1 className="text-2xl font-bold mb-6">简历 演示</h1>
      <p className="mb-4 text-gray-600">
        这个页面展示了新的 简历容器 组件，实现了拖拽、嵌套和不同布局类型。
        可以尝试拖拽块、编辑内容和添加新块。
      </p>
    </div>
  );
}
