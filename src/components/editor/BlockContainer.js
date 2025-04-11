'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { SortableHeadingBlock, SortableParagraphBlock } from './SortableBlock';
import { SortableThreeColumnBlock } from './SortableThreeColumnBlock';
import { SortableTwoColumnBlock } from './SortableTwoColumnBlock';
import { optimizeWithGemini } from '../../utils/geminiUtils';
import { toast } from 'sonner';

/**
 * BlockContainer - 可拖拽块的容器组件
 * 
 * 该组件负责:
 * 1. 拖拽上下文管理
 * 2. 分离父块和子块
 * 3. 处理嵌套拖拽逻辑
 * 4. 管理块的增删改
 */
export const BlockContainer = ({ blocks, onBlocksChange, onTextChange }) => {
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

  // 处理块菜单操作
  const handleBlockMenuClicked = (action, blockId) => {
    // 找到当前块
    const currentBlock = blocks.find(block => block.id === blockId);
    if (!currentBlock) return;
    
    console.log(`Block menu action: ${action} on block ${blockId}`);
    
    // 根据不同操作类型处理
    if (action === 'delete') {
      // 删除块操作
      if (window.confirm('确定要删除这个块吗？')) {
        // 获取该块的所有子块（如果有）
        const childBlocks = blocks.filter(block => block.parentId === blockId);
        
        // 如果有子块且当前块是标题，则需要提示用户
        if (childBlocks.length > 0 && currentBlock.type === 'heading') {
          if (!window.confirm(`该标题下有${childBlocks.length}个子块，删除该标题将同时删除所有子块，确定要删除吗？`)) {
            return;
          }
          
          // 删除该块及其所有子块
          const newBlocks = blocks.filter(block => block.id !== blockId && block.parentId !== blockId);
          onBlocksChange(newBlocks);
        } else {
          // 只删除该块
          const newBlocks = blocks.filter(block => block.id !== blockId);
          onBlocksChange(newBlocks);
        }
      }
    } else if (action === 'ai-optimize') {
      // AI 优化内容
      handleAiOptimize(blockId);
    } else {
      // 添加新块（按类型）
      addBlockAfter(blockId, action);
    }
  };
  
  // 向块的同级添加新块
  const addBlockAfter = (blockId, type) => {
    const currentBlock = blocks.find(block => block.id === blockId);
    if (!currentBlock) return;
    
    // 创建新块
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
    };
    
    // 设置新块的内容
    if (type === 'three-column') {
      newBlock.content = ['<p>左侧内容</p>', '<p>中间内容</p>', '<p>右侧内容</p>'];
    } else if (type === 'two-column') {
      newBlock.content = [
        '<div><p><strong>公司/学校名称</strong></p><p>城市, 国家</p><p>起止时间</p></div>', 
        '<div><p><strong>职位/学位</strong></p><p>详细描述内容...</p></div>'
      ];
    } else {
      newBlock.content = type === 'heading' ? '<h1>新标题</h1>' : '<p>新段落</p>';
    }
    
    let insertIndex;
    let newBlocks = [...blocks];
    
    // 特殊情况：从段落块添加标题块
    if (type === 'heading' && currentBlock.type !== 'heading' && currentBlock.parentId) {
      // 查找当前段落的父级标题块
      const parentBlock = blocks.find(block => block.id === currentBlock.parentId);
      if (parentBlock && parentBlock.type === 'heading') {
        // 查找父级标题的所有子块
        const childrenOfParent = blocks.filter(block => block.parentId === parentBlock.id);
        // 找到最后一个子块的索引
        const lastChildIndex = blocks.findIndex(block => block.id === childrenOfParent[childrenOfParent.length - 1].id);
        // 在父级的最后一个子块之后插入新标题块
        insertIndex = lastChildIndex + 1;
        // 设置新块的父级为空（因为标题块总是顶级块）
        newBlock.parentId = null;
      } else {
        // 如果找不到父级标题或父级不是标题，回退到默认行为
        insertIndex = blocks.findIndex(block => block.id === blockId) + 1;
        newBlock.parentId = null; // 标题块总是顶级块
      }
    } else {
      // 正常情况：在当前块后插入
      insertIndex = blocks.findIndex(block => block.id === blockId) + 1;
      
      // 设置父级关系
      if (type === 'heading') {
        // 标题块总是顶级块
        newBlock.parentId = null;
      } else if (currentBlock.type === 'heading') {
        // 如果当前是标题块，非标题新块成为其子块
        newBlock.parentId = currentBlock.id;
      } else {
        // 否则，新块继承当前块的父级
        newBlock.parentId = currentBlock.parentId;
      }
    }
    
    // 插入新块
    newBlocks.splice(insertIndex, 0, newBlock);
    onBlocksChange(newBlocks);
    console.log('Updated blocks:', newBlocks);
  };

  // 块被点击后的处理函数
  const handleAiOptimize = async (blockId) => {
    try {
      // 查找要优化的块
      const blockToOptimize = blocks.find(b => b.id === blockId);
      
      if (blockToOptimize) {
        // 显示正在处理的提示，并保存其ID以便后续关闭
        const loadingToastId = toast.loading('正在使用AI优化内容...');
        
        // 提取纯文本内容（去除HTML标签）
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blockToOptimize.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        try {
          // 调用优化API
          const optimizedContent = await optimizeWithGemini(textContent);
          console.log("optimizedContent:::",optimizedContent)
          

          // 更新块内容
          onBlocksChange(blocks.map(block => 
            block.id === blockId 
              ? { ...block, content: `${optimizedContent}` } 
              : block
          ));
          
          // 关闭loading提示并显示成功提示
          toast.dismiss(loadingToastId);
          toast.success('内容已优化');
        } catch (error) {
          // 关闭loading提示并显示错误提示
          toast.dismiss(loadingToastId);
          toast.error(`优化失败: ${error.message || '请检查API密钥是否正确设置'}`);
        }
      }
      return;
    } catch (error) {
      // 显示错误提示
      toast.error(`优化失败: ${error.message || '请检查API密钥是否正确设置'}`);
      return;
    }
  };

  // 修改块内容的处理函数
  const handleBlockChange = (blockId, newContent) => {
    console.log("handleBlockChange：：》：", blockId, newContent);
    // 查找并更新指定块的内容
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, content: newContent } : block
    );
    
    onBlocksChange(updatedBlocks);
  };
  
  // 渲染单个块
  const renderBlock = useCallback((block) => {
    
    switch (block.type) {
      case 'heading':
        return (
          <SortableHeadingBlock
            key={block.id}
            id={block.id}
            content={block.content}
            onChange={(blockId,newContent) => handleBlockChange(blockId, newContent)}
            onBlockMenuClicked={handleBlockMenuClicked}
            onTextChange={onTextChange}
          />
        );
      case 'paragraph':
        return (
          <SortableParagraphBlock
            key={block.id}
            id={block.id}
            content={block.content}
            onChange={(blockId, newContent) => handleBlockChange(blockId, newContent)}
            onBlockMenuClicked={handleBlockMenuClicked}
            onTextChange={onTextChange}
          />
        );
      case 'three-column':
        return (
          <SortableThreeColumnBlock
            key={block.id}
            id={block.id}
            content={block.content}
            onChange={(id, newContents) => handleBlockChange(id, newContents)}
            onBlockMenuClicked={handleBlockMenuClicked}
          />
        );
      case 'two-column':
        return (
          <SortableTwoColumnBlock
            key={block.id}
            id={block.id}
            content={block.content}
            onChange={(id, newContents) => handleBlockChange(id, newContents)}
            onBlockMenuClicked={handleBlockMenuClicked}
          />
        );
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  }, [handleBlockChange, handleBlockMenuClicked, onTextChange]);

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
                onChange={(blockId, newContent) => handleBlockChange(blockId, newContent)}
                onBlockMenuClicked={handleBlockMenuClicked}
                onTextChange={onTextChange}
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
