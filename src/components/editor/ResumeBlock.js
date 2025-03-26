'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heading1, Text, LayoutGrid, PanelLeftClose, GripVertical } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import * as Popover from '@radix-ui/react-popover';
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
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BlockMenu = ({ onFormatClick, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-50 bg-white shadow-lg rounded-lg p-2 flex gap-2"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <button
        onClick={() => onFormatClick('bold')}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => onFormatClick('italic')}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <span className="italic">I</span>
      </button>
      <button
        onClick={() => onFormatClick('underline')}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <span className="underline">U</span>
      </button>
    </motion.div>
  );
};

const blockTypeOptions = [
  {
    icon: <Heading1 className="w-4 h-4" />,
    label: '标题',
    type: 'heading'
  },
  {
    icon: <Text className="w-4 h-4" />,
    label: '段落',
    type: 'paragraph'
  }
];

export const ResumeBlock = ({
  content,
  onChange,
  type = 'paragraph',
  onAddBlock,
  id,
  isDragging,
  dragHandle = null,
  isHeading = type === 'heading',
  parentId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragHandleHovered, setIsDragHandleHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const blockRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `outline-none text-gray-900 ${type === 'heading' ? 'text-xl font-bold' : ''} min-h-[1.5em] focus:outline-none`
      }
    }
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Only hide if we're not hovering the drag handle
    if (!isDragHandleHovered) {
      setIsHovered(false);
      setShowMenu(false);
    }
  };

  const handleDragHandleEnter = () => {
    setIsDragHandleHovered(true);
    setIsHovered(true);
  };

  const handleDragHandleLeave = () => {
    setIsDragHandleHovered(false);
    // Only hide if we're not hovering the main block
    if (!isHovered) {
      setIsHovered(false);
    }
  };

  const handleClick = (e) => {
    // Don't show formatting menu when clicking on drag handle
    if (e.target.closest('.drag-handle')) return;
    
    const rect = blockRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40,
      });
      setShowMenu(true);
    }
  };

  const handleFormat = (format) => {
    if (!editor) return;
    
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
    }
  };

  return (
    <div className={`relative group ${isDragging ? 'opacity-50' : ''}`}>
      {/* Drag handle positioned outside the block but connected to hover states */}
      {dragHandle && (
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-6 transition-opacity drag-handle cursor-grab z-10 ${isHovered || isDragHandleHovered ? 'opacity-100' : 'opacity-0'}`}
          onMouseEnter={handleDragHandleEnter}
          onMouseLeave={handleDragHandleLeave}
          ref={dragHandle}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div
        ref={blockRef}
        className={`relative ${
          isHovered ? 'bg-gray-50' : ''
        } p-2 rounded transition-colors`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <EditorContent editor={editor} />
        
        <AnimatePresence>
          {showMenu && (
            <BlockMenu
              position={menuPosition}
              onFormatClick={handleFormat}
            />
          )}
        </AnimatePresence>
      </div>
      
      <Popover.Root>
        <Popover.Trigger asChild>
          <div className="absolute left-0 right-0 h-4 -bottom-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white shadow-sm hover:shadow rounded-full p-1 cursor-pointer">
              <Plus className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
            sideOffset={5}
          >
            {blockTypeOptions.map((option) => (
              <button
                key={option.type + (option.layout || '')}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded text-left"
                onClick={() => {
                  onAddBlock(option.type, option.layout, id);
                }}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

// 可排序项组件 - 父级块
const SortableHeadingItem = ({ headingBlock, blocks, onBlocksChange, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: headingBlock.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="relative">
        <div 
          className="absolute left-0 top-4 -ml-6 cursor-grab z-10"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <ResumeBlock
          id={headingBlock.id}
          content={headingBlock.content}
          type={headingBlock.type}
          onChange={(newContent) => {
            const updatedBlocks = blocks.map(block => 
              block.id === headingBlock.id ? { ...block, content: newContent } : block
            );
            onBlocksChange(updatedBlocks);
          }}
          onAddBlock={(type, layout, blockId) => {
            // Function to add a new block after the current one
            const newBlock = {
              id: `block-${Date.now()}`,
              content: '',
              type,
              layout,
              parentId: type === 'heading' ? null : headingBlock.id
            };
            
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            const newBlocks = [...blocks];
            newBlocks.splice(blockIndex + 1, 0, newBlock);
            onBlocksChange(newBlocks);
          }}
          isDragging={isDragging}
          isHeading={true}
        />
        
        {children}
      </div>
    </div>
  );
};

// 可排序项组件 - 子级块
const SortableChildItem = ({ childBlock, headingBlock, blocks, onBlocksChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: childBlock.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ResumeBlock
        id={childBlock.id}
        content={childBlock.content}
        type={childBlock.type}
        layout={childBlock.layout}
        parentId={headingBlock.id}
        dragHandle={attributes.ref}
        isDragging={isDragging}
        onChange={(newContent) => {
          const updatedBlocks = blocks.map(block => 
            block.id === childBlock.id ? { ...block, content: newContent } : block
          );
          onBlocksChange(updatedBlocks);
        }}
        onAddBlock={(type, layout, blockId) => {
          // Function to add a new block after the current one
          const newBlock = {
            id: `block-${Date.now()}`,
            content: '',
            type,
            layout,
            parentId: headingBlock.id
          };
          
          const blockIndex = blocks.findIndex(b => b.id === blockId);
          const newBlocks = [...blocks];
          newBlocks.splice(blockIndex + 1, 0, newBlock);
          onBlocksChange(newBlocks);
        }}
      />
    </div>
  );
};

export const ResumeBlockContainer = ({ blocks, onBlocksChange }) => {
  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group blocks by parent-child relationships for dragging
  const getGroupedBlocks = () => {
    // Find all heading blocks (those with type heading)
    const headingBlocks = blocks.filter(block => block.type === 'heading');
    
    // For each heading, gather its children
    return headingBlocks.map(headingBlock => {
      const children = blocks.filter(block => block.parentId === headingBlock.id);
      return {
        ...headingBlock,
        children
      };
    });
  };
  
  const groupedBlocks = getGroupedBlocks();
  
  // 提取所有标题ID作为排序列表
  const headingIds = groupedBlocks.map(heading => heading.id);
  
  // 处理父级块拖拽结束事件
  const handleHeadingDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    
    try {
      // 找到被拖动的标题块索引
      const oldIndex = groupedBlocks.findIndex(block => block.id === active.id);
      const newIndex = groupedBlocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // 重新排序标题块
        const reorderedHeadings = arrayMove(groupedBlocks, oldIndex, newIndex);
        
        // 重建blocks数组
        const newBlocks = [];
        reorderedHeadings.forEach(headingBlock => {
          newBlocks.push({
            id: headingBlock.id,
            content: headingBlock.content,
            type: headingBlock.type,
            layout: headingBlock.layout,
            parentId: headingBlock.parentId
          });
          
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
  
  // 处理子级块拖拽结束事件
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
            layout: block.layout,
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
            <SortableHeadingItem
              key={headingBlock.id}
              headingBlock={headingBlock}
              blocks={blocks}
              onBlocksChange={onBlocksChange}
            >
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
                        <SortableChildItem
                          key={childBlock.id}
                          childBlock={childBlock}
                          headingBlock={headingBlock}
                          blocks={blocks}
                          onBlocksChange={onBlocksChange}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </SortableHeadingItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};
