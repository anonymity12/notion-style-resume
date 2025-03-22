'use client';

import React, { useState, useEffect } from 'react';
import { ResumeBlockContainer } from './ResumeBlock';
import { DragDropContext } from 'react-beautiful-dnd';

export default function SimpleResume() {
  const [mounted, setMounted] = useState(false);
  
  // Preset resume blocks with parent-child relationships
  const [blocks, setBlocks] = useState([
    // Personal Information
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
      id: 'paragraph-location',
      content: '<p><strong>地址：</strong>北京市海淀区</p>',
      type: 'paragraph',
      parentId: 'heading-personal'
    },

    // Education Experience 1
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
    
    // Education Experience 2
    {
      id: 'paragraph-edu2',
      content: '<p><strong>剑桥大学</strong> | 人工智能 | 2022-2023</p>',
      type: 'paragraph',
      parentId: 'heading-education'
    },
    {
      id: 'paragraph-edu2-detail',
      content: '<p>硕士学位 | 优秀毕业生 | 研究方向：自然语言处理</p>',
      type: 'paragraph',
      parentId: 'heading-education'
    },

    // Work Experience 1
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
    },
    
    // Work Experience 2
    {
      id: 'paragraph-work2',
      content: '<p><strong>阿里巴巴</strong> | 实习生 | 2022-2023</p>',
      type: 'paragraph',
      parentId: 'heading-work'
    },
    {
      id: 'paragraph-work2-detail1',
      content: '<p>参与电商平台前端开发，负责商品展示模块</p>',
      type: 'paragraph',
      parentId: 'heading-work'
    },
    {
      id: 'paragraph-work2-detail2',
      content: '<p>实现响应式设计，提升移动端用户体验</p>',
      type: 'paragraph',
      parentId: 'heading-work'
    },

    // Project Experience
    {
      id: 'heading-project',
      content: '<h1>项目经验</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-project1',
      content: '<p><strong>个人简历编辑器</strong> | 2023</p>',
      type: 'paragraph',
      parentId: 'heading-project'
    },
    {
      id: 'paragraph-project1-detail1',
      content: '<p>基于React开发的在线简历编辑工具，支持拖拽排序和实时编辑</p>',
      type: 'paragraph',
      parentId: 'heading-project'
    },
    {
      id: 'paragraph-project1-detail2',
      content: '<p>使用Next.js构建，实现SSR提升首屏加载速度</p>',
      type: 'paragraph',
      parentId: 'heading-project'
    },
    {
      id: 'paragraph-project1-detail3',
      content: '<p>集成Tailwind CSS实现响应式设计，适配各种屏幕尺寸</p>',
      type: 'paragraph',
      parentId: 'heading-project'
    },

    // Skills
    {
      id: 'heading-skills',
      content: '<h1>技能专长</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-skill1',
      content: '<p><strong>编程语言：</strong>JavaScript, TypeScript, Python, Java</p>',
      type: 'paragraph',
      parentId: 'heading-skills'
    },
    {
      id: 'paragraph-skill2',
      content: '<p><strong>前端技术：</strong>React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS</p>',
      type: 'paragraph',
      parentId: 'heading-skills'
    },
    {
      id: 'paragraph-skill3',
      content: '<p><strong>后端技术：</strong>Node.js, Express, MongoDB, MySQL</p>',
      type: 'paragraph',
      parentId: 'heading-skills'
    },
    {
      id: 'paragraph-skill4',
      content: '<p><strong>工具与平台：</strong>Git, Docker, AWS, Vercel</p>',
      type: 'paragraph',
      parentId: 'heading-skills'
    },

    // Campus Experience
    {
      id: 'heading-campus',
      content: '<h1>校园经历</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-campus1',
      content: '<p><strong>学生会技术部</strong> | 部长 | 2020-2022</p>',
      type: 'paragraph',
      parentId: 'heading-campus'
    },
    {
      id: 'paragraph-campus1-detail',
      content: '<p>负责校园网站维护与技术支持，组织多场技术讲座</p>',
      type: 'paragraph',
      parentId: 'heading-campus'
    },
    {
      id: 'paragraph-campus2',
      content: '<p><strong>ACM程序设计竞赛</strong> | 校队队员 | 2019-2021</p>',
      type: 'paragraph',
      parentId: 'heading-campus'
    },
    {
      id: 'paragraph-campus2-detail',
      content: '<p>获区域赛铜牌，培训新队员算法基础</p>',
      type: 'paragraph',
      parentId: 'heading-campus'
    }
  ]);

  useEffect(() => {
    // Only set mounted to true on the client side to prevent hydration issues
    setMounted(true);
    
    // Add this cleanup function to handle any lingering drag operations
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const handleBlocksChange = (newBlocks) => {
    setBlocks(newBlocks);
    console.log('Blocks updated:', newBlocks);
  };
  
  const onDragEnd = (result) => {
    // Safety check - if component is not mounted, don't proceed
    if (!mounted) return;
    
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    console.log('Drag ended:', result);
    
    try {
      // Create a new blocks array based on the drag result
      const newBlocks = [...blocks];
      
      // Find the dragged block
      const draggedBlock = newBlocks.find(block => block.id === draggableId);
      
      if (!draggedBlock) {
        console.error('Could not find dragged block:', draggableId);
        return;
      }
      
      // If it's a heading block, we need to get all its children as well
      let blocksToDrag = [draggedBlock];
      
      if (draggedBlock.type === 'heading') {
        // Get all child blocks that belong to this heading
        const childBlocks = newBlocks.filter(block => block.parentId === draggedBlock.id);
        blocksToDrag = [draggedBlock, ...childBlocks];
      }
      
      // Remove the blocks from their original position
      const blocksWithoutDragged = newBlocks.filter(block => !blocksToDrag.includes(block));
      
      // Calculate new index
      let insertIndex = destination.index;
      
      // If we're moving a block downwards, we need to adjust the insert index
      // based on the number of elements we're removing from before the destination
      const elementsBeforeDestination = blocksToDrag.filter(block => 
        newBlocks.indexOf(block) < destination.index
      ).length;
      
      insertIndex -= elementsBeforeDestination;
      
      // Insert the blocks at the new position
      blocksWithoutDragged.splice(insertIndex, 0, ...blocksToDrag);
      
      // Update block state
      handleBlocksChange(blocksWithoutDragged);
    } catch (error) {
      console.error('Error in drag operation:', error);
    }
  };

  // Don't render anything until the component is mounted on the client
  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">简约风格简历</h1>
        <p className="text-gray-500 text-center mb-8">拖拽各个模块调整顺序，点击内容可以编辑</p>
        <div className="border p-8 rounded-lg shadow-md max-w-4xl mx-auto bg-white">
          <ResumeBlockContainer
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
          />
        </div>
      </div>
    </DragDropContext>
  );
}
