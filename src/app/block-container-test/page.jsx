'use client';

import React, { useState, useEffect } from 'react';
import { BlockContainer } from '../../components/editor/BlockContainer';

export default function BlockContainerTest() {
  const [mounted, setMounted] = useState(false);
  
  // 示例数据 - 包含不同类型的块和嵌套结构
  const [blocks, setBlocks] = useState([
    // 个人信息部分
    {
      id: 'heading-personal',
      content: '<h1>个人信息</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-name',
      content: '<p><strong>姓名：</strong>张三</p>',
      type: 'paragraph',
      parentId: 'heading-personal'
    },
    {
      id: 'paragraph-contact',
      content: '<p><strong>联系方式：</strong>电话: 188-8888-8888 | 邮箱: zhangsan@example.com</p>',
      type: 'paragraph',
      parentId: 'heading-personal'
    },
    {
      id: 'horizontal-layout-1',
      content: '<p>水平布局演示</p>',
      type: 'paragraph',
      layout: 'horizontal',
      parentId: 'heading-personal'
    },

    // 教育经历部分
    {
      id: 'heading-education',
      content: '<h1>教育经历</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-edu1',
      content: '<p><strong>北京大学</strong> | 计算机科学与技术 | 2018-2022</p>',
      type: 'paragraph',
      parentId: 'heading-education'
    },
    {
      id: 'paragraph-edu1-detail',
      content: '<p>GPA: 3.8/4.0 | 相关课程：数据结构、算法设计、操作系统、计算机网络</p>',
      type: 'paragraph',
      parentId: 'heading-education'
    },
    {
      id: 'vertical-layout-1',
      content: '<p>垂直布局演示</p>',
      type: 'paragraph',
      layout: 'vertical',
      parentId: 'heading-education'
    },
    
    // 工作经历部分
    {
      id: 'heading-work',
      content: '<h1>工作经历</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-work1',
      content: '<p><strong>腾讯</strong> | 前端工程师 | 2023-至今</p>',
      type: 'paragraph',
      parentId: 'heading-work'
    },
    {
      id: 'paragraph-work1-detail1',
      content: '<p>负责微信小程序核心功能开发与优化</p>',
      type: 'paragraph',
      parentId: 'heading-work'
    },
    {
      id: 'paragraph-work1-detail2',
      content: '<p>优化前端性能，页面加载速度提升30%</p>',
      type: 'paragraph',
      parentId: 'heading-work'
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
      <h1 className="text-2xl font-bold mb-6">BlockContainer 演示</h1>
      <p className="mb-4 text-gray-600">
        这个页面展示了新的 BlockContainer 组件，实现了拖拽、嵌套和不同布局类型。
        可以尝试拖拽块、编辑内容和添加新块。
      </p>
      
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
    </div>
  );
}
