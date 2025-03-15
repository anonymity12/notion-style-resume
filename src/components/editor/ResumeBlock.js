'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heading1, Text, LayoutGrid, PanelLeftClose } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import * as Popover from '@radix-ui/react-popover';

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

export const ResumeBlock = ({
  content,
  onChange,
  type = 'paragraph',
  onAddBlock,
  id
}) => {
  const [isHovered, setIsHovered] = useState(false);
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
    setIsHovered(false);
    setShowMenu(false);
  };

  const handleClick = (e) => {
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
    <div className="relative group">
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

        {isHovered && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        )}
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
            className="bg-white rounded-lg shadow-lg p-2 w-40 z-50"
            sideOffset={5}
          >
            <div className="flex flex-col gap-1">
              {blockTypeOptions.map((option) => (
                <button
                  key={option.type + (option.layout || '')}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded text-sm text-gray-700 transition-colors"
                  onClick={() => {
                    onAddBlock(option.type, option.layout);
                  }}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
