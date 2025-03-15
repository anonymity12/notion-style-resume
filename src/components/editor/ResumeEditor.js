'use client';

import React, { useState } from 'react';
import { ResumeBlock } from './ResumeBlock';

const initialBlocks = [
  {
    id: '1',
    content: '<h1>个人简历</h1>',
    type: 'heading',
  },
  {
    id: '2',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '2-1',
        content: '<p><strong>姓名：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '2-2',
        content: '<p><strong>年龄：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '2-3',
        content: '<p><strong>电话：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '2-4',
        content: '<p><strong>邮箱：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '3',
    content: '<h1>教育经历</h1>',
    type: 'heading',
  },
  {
    id: '4',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '4-1',
        content: '<p><strong>学校名称：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '4-2',
        content: '<p><strong>专业：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '5',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '5-1',
        content: '<p><strong>学历：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '5-2',
        content: '<p><strong>在校时间：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '6',
    content: '<h1>工作经验</h1>',
    type: 'heading',
  },
  {
    id: '7',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '7-1',
        content: '<p><strong>公司名称：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '7-2',
        content: '<p><strong>职位：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '8',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '8-1',
        content: '<p><strong>工作时间：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '8-2',
        content: '<p><strong>工作地点：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '9',
    content: '<p><strong>工作内容：</strong></p>',
    type: 'paragraph',
  },
  {
    id: '10',
    content: '<h1>项目经验</h1>',
    type: 'heading',
  },
  {
    id: '11',
    layout: 'horizontal',
    type: 'paragraph',
    children: [
      {
        id: '11-1',
        content: '<p><strong>项目名称：</strong></p>',
        type: 'paragraph',
      },
      {
        id: '11-2',
        content: '<p><strong>项目时间：</strong></p>',
        type: 'paragraph',
      },
    ],
  },
  {
    id: '12',
    content: '<p><strong>项目描述：</strong></p>',
    type: 'paragraph',
  },
  {
    id: '13',
    content: '<p><strong>负责内容：</strong></p>',
    type: 'paragraph',
  },
  {
    id: '14',
    content: '<p><strong>项目成果：</strong></p>',
    type: 'paragraph',
  },
  {
    id: '15',
    content: '<h1>专业技能</h1>',
    type: 'heading',
  },
  {
    id: '16',
    content: '<p>• 技能1</p><p>• 技能2</p><p>• 技能3</p>',
    type: 'paragraph',
  },
  {
    id: '17',
    content: '<h1>自我评价</h1>',
    type: 'heading',
  },
  {
    id: '18',
    content: '<p>在这里添加你的自我评价...</p>',
    type: 'paragraph',
  },
];

export const ResumeEditor = () => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleBlockChange = (id, newContent) => {
    const updateBlockContent = (blocks) => {
      return blocks.map(block => {
        if ('content' in block && block.id === id) {
          return { ...block, content: newContent };
        }
        if ('children' in block) {
          return {
            ...block,
            children: updateBlockContent(block.children)
          };
        }
        return block;
      });
    };

    setBlocks(updateBlockContent(blocks));
  };

  const addNewBlock = (afterId, type, layout) => {
    const newBlock = layout ? {
      id: Math.random().toString(36).substr(2, 9),
      type,
      layout,
      children: [],
    } : {
      id: Math.random().toString(36).substr(2, 9),
      content: type === 'heading' ? '<h1></h1>' : '<p></p>',
      type,
    };
    
    const addBlockAfter = (blocks) => {
      const index = blocks.findIndex(block => block.id === afterId);
      if (index !== -1) {
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      }
      
      return blocks.map(block => {
        if ('children' in block) {
          return {
            ...block,
            children: addBlockAfter(block.children)
          };
        }
        return block;
      });
    };

    setBlocks(addBlockAfter(blocks));
  };

  const renderBlocks = (blocks) => {
    return blocks.map((block) => {
      if ('children' in block) {
        return (
          <div 
            key={block.id} 
            className={`grid ${block.layout === 'horizontal' ? 'grid-cols-2 md:grid-cols-4 gap-4' : 'grid-cols-1 gap-2'}`}
          >
            {renderBlocks(block.children)}
          </div>
        );
      }

      return (
        <ResumeBlock
          key={block.id}
          id={block.id}
          content={block.content}
          type={block.type}
          onChange={(content) => handleBlockChange(block.id, content)}
          onAddBlock={(type, layout) => addNewBlock(block.id, type, layout)}
        />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-sm rounded-lg space-y-4">
      {renderBlocks(blocks)}
    </div>
  );
};
