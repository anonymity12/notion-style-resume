'use client';

import React, { useState, useEffect } from 'react';
import { ResumeBlockContainer } from './ResumeBlock';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export default function DragTest() {
  const [mounted, setMounted] = useState(false);
  
  // Sample data with parent-child relationships
  const [blocks, setBlocks] = useState([
    {
      id: 'heading-1',
      content: '<h1>教育经历</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-1',
      content: '<p>北京大学 计算机科学 2018-2022</p>',
      type: 'paragraph',
      parentId: 'heading-1'
    },
    {
      id: 'paragraph-2',
      content: '<p>GPA: 3.8/4.0</p>',
      type: 'paragraph',
      parentId: 'heading-1'
    },
    {
      id: 'heading-2',
      content: '<h1>工作经历</h1>',
      type: 'heading',
      parentId: null
    },
    {
      id: 'paragraph-3',
      content: '<p>腾讯 前端工程师 2022-至今</p>',
      type: 'paragraph',
      parentId: 'heading-2'
    },
    {
      id: 'paragraph-4',
      content: '<p>负责微信小程序开发</p>',
      type: 'paragraph',
      parentId: 'heading-2'
    }
  ]);

  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor)
  );

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
  
  const handleDragEnd = (event) => {
    // Safety check - if component is not mounted, don't proceed
    if (!mounted) return;
    
    const { active, over } = event;
    
    // If there's no destination, don't proceed
    if (!over) return;
    
    // If the item was dropped back in its original position
    if (active.id === over.id) return;
    
    console.log('Drag ended:', event);
    
    try {
      // Create a new blocks array based on the drag result
      const newBlocks = [...blocks];
      
      // Find the dragged block
      const draggedBlockIndex = newBlocks.findIndex(block => block.id === active.id);
      const overBlockIndex = newBlocks.findIndex(block => block.id === over.id);
      
      if (draggedBlockIndex === -1) {
        console.error('Could not find dragged block:', active.id);
        return;
      }
      
      const draggedBlock = newBlocks[draggedBlockIndex];
      
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
      let insertIndex = overBlockIndex;
      
      // If we're moving a block downwards, we need to adjust the insert index
      // based on the number of elements we're removing from before the destination
      const elementsBeforeDestination = blocksToDrag.filter(block => 
        newBlocks.indexOf(block) < overBlockIndex
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
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">简历拖拽测试</h1>
        <div className="border p-4 rounded-lg">
          <ResumeBlockContainer
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
          />
        </div>
      </div>
    </DndContext>
  );
}
