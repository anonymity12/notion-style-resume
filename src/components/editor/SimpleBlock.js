'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heading1, Text, LayoutGrid, PanelLeftClose, GripVertical } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import * as Popover from '@radix-ui/react-popover';

/**
 * 格式化菜单组件 - 处理文本格式化操作
 */
const FormatMenu = ({ onFormatClick, position }) => {
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

/**
 * 添加块菜单选项
 */
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
  },
  {
    icon: <LayoutGrid className="w-4 h-4" />,
    label: '水平布局',
    type: 'paragraph',
    layout: 'horizontal'
  },
  {
    icon: <PanelLeftClose className="w-4 h-4" />,
    label: '垂直布局',
    type: 'paragraph',
    layout: 'vertical'
  }
];

/**
 * SimpleBlock - 基础内容块组件
 * 
 * 这个组件只负责:
 * 1. 内容编辑功能
 * 2. 添加新块的UI
 * 3. 基础样式
 * 
 * 不负责:
 * - 拖拽逻辑（由外层组件提供）
 * - 父子关系逻辑（由外层组件提供）
 */
export const SimpleBlock = ({
  id,
  content,
  onChange,
  onAddBlock,
  type = 'paragraph',
  layout = 'default',
  className = '',
  showAddMenu = true,
  renderDragHandle = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const blockRef = useRef(null);

  // 设置编辑器
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
    setIsHovered(false);
    setShowFormatMenu(false);
  };

  const handleClick = (e) => {
    // 点击拖拽手柄区域不显示格式菜单
    if (e.target.closest('.drag-handle')) return;
    
    const rect = blockRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40,
      });
      setShowFormatMenu(true);
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

  // 根据布局类型设置样式
  const layoutClasses = layout === 'horizontal' 
    ? 'flex flex-row gap-4' 
    : layout === 'vertical' 
      ? 'flex flex-col gap-2' 
      : '';

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 渲染拖拽手柄 - 如果提供了渲染函数 */}
      {renderDragHandle && renderDragHandle(isHovered)}

      <div
        ref={blockRef}
        className={`${
          isHovered ? 'bg-gray-50' : ''
        } p-2 rounded transition-colors ${layoutClasses}`}
        onClick={handleClick}
      >
        <EditorContent editor={editor} />
        
        <AnimatePresence>
          {showFormatMenu && (
            <FormatMenu
              position={menuPosition}
              onFormatClick={handleFormat}
            />
          )}
        </AnimatePresence>
      </div>
      
      {showAddMenu && (
        <AddBlockMenu 
          onAddBlock={(type, layout) => onAddBlock(type, layout, id)} 
          isVisible={isHovered}
        />
      )}
    </div>
  );
};

/**
 * 添加块菜单组件 - 处理添加新块的UI
 */
const AddBlockMenu = ({ onAddBlock, isVisible }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className={`absolute left-0 right-0 h-4 -bottom-2 flex items-center justify-center transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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
                onAddBlock(option.type, option.layout);
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

/**
 * 创建水平布局块
 */
export const HorizontalBlock = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-row gap-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * 创建垂直布局块
 */
export const VerticalBlock = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  );
};
