'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableBlock, SortableHeadingBlock, SortableParagraphBlock, SortableThreeColumnBlock } from './SortableBlock';

/**
 * BlockContainer - 可拖拽块的容器组件
 * 
 * 该组件负责:
 * 1. 拖拽上下文管理
 * 2. 分离父块和子块
 * 3. 处理嵌套拖拽逻辑
 * 4. 管理块的增删改
 */
export const BlockContainer = ({ blocks, onBlocksChange }) => {
  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor)
  );

  // 将扁平数组按父子关系分组
  const getGroupedBlocks = () => {
    // 找出所有标题块（类型为heading的块）
    const headingBlocks = blocks.filter(block => block.type === 'heading');
    
    // 为每个标题收集其子块
    return headingBlocks.map(headingBlock => {
      const children = blocks.filter(block => block.parentId === headingBlock.id);
      return {
        ...headingBlock,
        children
      };
    });
  };
  
  const groupedBlocks = getGroupedBlocks();
  
  // 提取所有标题ID作为顶级排序列表
  const headingIds = groupedBlocks.map(heading => heading.id);
  
  // 处理标题块（父块）拖拽结束事件
  const handleHeadingDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    
    try {
      // 找到被拖动的标题块索引和目标索引
      const oldIndex = groupedBlocks.findIndex(block => block.id === active.id);
      const newIndex = groupedBlocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // 重新排序标题块
        const reorderedHeadings = arrayMove(groupedBlocks, oldIndex, newIndex);
        
        // 重建扁平的blocks数组
        const newBlocks = [];
        reorderedHeadings.forEach(headingBlock => {
          // 先添加标题
          newBlocks.push({
            id: headingBlock.id,
            content: headingBlock.content,
            type: headingBlock.type,
            parentId: headingBlock.parentId
          });
          
          // 再添加所有子块
          headingBlock.children.forEach(child => {
            newBlocks.push(child);
          });
        });
        
        onBlocksChange(newBlocks);
      }
    } catch (error) {
      console.error("Error handling heading drag end:", error);
    }
  };
  
  // 处理特定标题下子块的拖拽
  const handleChildDragEnd = (event, headingBlock) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    
    try {
      // 获取当前标题下的所有子块
      const children = [...headingBlock.children];
      
      // 找到被拖动和目标位置的索引
      const oldIndex = children.findIndex(block => block.id === active.id);
      const newIndex = children.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // 重新排序子块
        const reorderedChildren = arrayMove(children, oldIndex, newIndex);
        
        // 更新组内所有标题块
        const updatedGroupedBlocks = groupedBlocks.map(block => 
          block.id === headingBlock.id 
            ? { ...block, children: reorderedChildren } 
            : block
        );
        
        // 重建blocks数组
        const newBlocks = [];
        updatedGroupedBlocks.forEach(block => {
          newBlocks.push({
            id: block.id,
            content: block.content,
            type: block.type,
            parentId: block.parentId
          });
          
          block.children.forEach(child => {
            newBlocks.push(child);
          });
        });
        
        onBlocksChange(newBlocks);
      }
    } catch (error) {
      console.error("Error handling child drag end:", error);
    }
  };

  // 添加新块的处理函数
  const handleAddBlock = (type, blockId) => {
    // 找到当前块的索引
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    
    // 找到当前块
    const currentBlock = blocks[blockIndex];
    
    // 创建新块
    const newBlock = {
      id: `block-${Date.now()}`,
      content: type === 'heading' ? '<h1>新标题</h1>' : 
               type === 'three-column' ? ['<p>左侧内容</p>', '<p>中间内容</p>', '<p>右侧内容</p>'] : '<p>新段落</p>',
      type,
      // 如果添加的是标题块，parentId为null，否则继承当前块的parentId
      parentId: type === 'heading' ? null : currentBlock.parentId
    };
    
    // 在当前块后插入新块
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    onBlocksChange(newBlocks);
  };
  
  // 修改块内容的处理函数
  const handleBlockChange = (blockId, newContent) => {
    // 查找并更新指定块的内容
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, content: newContent } : block
    );
    
    onBlocksChange(updatedBlocks);
  };
  
  // 渲染单个块
  const renderBlock = (block) => {
    // 基于块类型渲染不同组件
    if (block.type === 'heading') {
      return (
        <SortableHeadingBlock
          key={block.id}
          id={block.id}
          content={block.content}
          onChange={(newContent) => handleBlockChange(block.id, newContent)}
          onAddBlock={handleAddBlock}
        />
      );
    } else if (block.type === 'three-column') {
      return (
        <SortableThreeColumnBlock
          key={block.id}
          id={block.id}
          contents={block.content}
          onChange={(_, newContents) => handleBlockChange(block.id, newContents)}
          onAddBlock={handleAddBlock}
        />
      );
    } else {
      return (
        <SortableParagraphBlock
          key={block.id}
          id={block.id}
          content={block.content}
          onChange={(newContent) => handleBlockChange(block.id, newContent)}
          onAddBlock={handleAddBlock}
        />
      );
    }
  };
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleHeadingDragEnd}
    >
      <div className="flex flex-col gap-2">
        <SortableContext
          items={headingIds}
          strategy={verticalListSortingStrategy}
        >
          {groupedBlocks.map((headingBlock) => (
            <div key={headingBlock.id} className="mb-6">
              {/* 渲染标题块 */}
              <SortableHeadingBlock
                id={headingBlock.id}
                content={headingBlock.content}
                onChange={(newContent) => handleBlockChange(headingBlock.id, newContent)}
                onAddBlock={handleAddBlock}
              />
              
              {/* 渲染子块 */}
              {headingBlock.children.length > 0 && (
                <div className="pl-4 mt-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleChildDragEnd(event, headingBlock)}
                  >
                    <SortableContext
                      items={headingBlock.children.map(child => child.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {headingBlock.children.map((childBlock) => (
                        <div key={childBlock.id} className="mb-2">
                          {renderBlock(childBlock)}
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};
