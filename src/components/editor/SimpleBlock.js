'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heading1, Text, LayoutGrid, GripVertical, Columns3, Trash2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import * as Popover from '@radix-ui/react-popover';

/**
 * 格式化菜单组件 - 处理文本格式化操作
 */
const FormatMenu = ({ onFormatClick, position, editor, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-50 bg-white shadow-lg rounded-lg p-2 flex gap-2"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
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
      <button
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run();
          onClose();
        }}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <span>清除格式</span>
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
    icon: <Columns3 className="w-4 h-4" />,
    label: '三列布局',
    type: 'three-column'
  },
  {
    icon: <Trash2 className="w-4 h-4 text-red-600" />,
    label: '删除块',
    type: 'delete'
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
  onBlockMenuClicked,
  type = 'paragraph',
  className = '',
  renderDragHandle = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState({ top: 0, left: 0 });
  const blockRef = useRef(null);

  // 设置编辑器
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        class: `outline-none text-gray-900 ${type === 'heading' ? 'text-xl font-bold' : ''} min-h-[1.5em] focus:outline-none`
      }
    }
  });

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        const htmlContent = editor.getHTML();
        if (onChange) {
          onChange(htmlContent);
        }
      });
    }
    return () => {
      if (editor) {
        editor.off('update');
      }
    };
  }, [editor, onChange]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowFormatMenu(false);
  };

  const handleClick = (e) => {
    const rect = blockRef.current?.getBoundingClientRect();
    if (rect) {
      setFormatMenuPosition({
        top: e.clientY - rect.top,
        left: e.clientX - rect.left,
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

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderDragHandle && renderDragHandle(isHovered)}
      
      <div
        className={`relative w-full transition-all rounded hover:bg-gray-50 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        ref={blockRef}
      >
        <div className="p-2">
          <EditorContent editor={editor} />
        </div>
        
        <AnimatePresence>
          {showFormatMenu && (
            <FormatMenu
              position={formatMenuPosition}
              editor={editor}
              onClose={() => setShowFormatMenu(false)}
              onFormatClick={handleFormat}
            />
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
};
