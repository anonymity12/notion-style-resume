'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';

import SortableUserInfoBlock from './SortableUserInfoBlock';
import SortableEducationBlock from './SortableEducationBlock';
import { useResume } from '../../context/ResumeContext';

/**
 * ResumeBlockContainer - 可拖拽简历块的容器组件
 * 
 * 该组件负责:
 * 1. 提供简历各部分的拖拽功能
 * 2. 管理简历块的排序顺序
 */
export const ResumeBlockContainer = () => {
  // 定义初始的简历块ID和类型
  const initialBlocks = [
    { id: 'user-info-block', type: 'user-info' },
    { id: 'education-block', type: 'education' }
  ];
  
  // 管理块的顺序
  const [blocks, setBlocks] = useState(initialBlocks);
  
  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor)
  );
  
  // 处理拖拽结束事件
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setBlocks(currentBlocks => {
      const oldIndex = currentBlocks.findIndex(block => block.id === active.id);
      const newIndex = currentBlocks.findIndex(block => block.id === over.id);
      
      return arrayMove(currentBlocks, oldIndex, newIndex);
    });
  };
  
  // 渲染特定类型的块
  const renderBlock = (block) => {
    switch (block.type) {
      case 'user-info':
        return <SortableUserInfoBlock key={block.id} id={block.id} />;
      case 'education':
        return <SortableEducationBlock key={block.id} id={block.id} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="resume-block-container max-w-4xl mx-auto pl-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map(block => renderBlock(block))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ResumeBlockContainer;
