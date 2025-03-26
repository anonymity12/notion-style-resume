'use client';

import React, { useState } from 'react';
import { GripVertical, Heading1, Text, Columns3, Trash2, Plus } from 'lucide-react';
import { SimpleBlock } from './SimpleBlock';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Popover from '@radix-ui/react-popover';

/**
 * SortableBlock - 可拖拽的块组件
 * 
 * 该组件专注于处理拖拽功能，并将内容渲染委托给 SimpleBlock
 * 
 * Props:
 * - id: 块的唯一标识符（用于拖拽识别）
 * - content: 块的HTML内容
 * - onChange: 内容变更时的回调函数
 * - onBlockMenuClicked: 块上下文菜单被点击后的回调函数
 * - type: 块类型（'heading' 或 'paragraph'）
 * - isDark: 是否处于暗色模式
 * - children: 子组件
 * - showFormatMenu: 是否显示格式菜单
 */
export const SortableBlock = ({
  id,
  content,
  onChange,
  onBlockMenuClicked,
  type = 'paragraph',
  isDark = false,
  children,
  showFormatMenu = true,
  className = '',
  showClickedMenu = true,
}) => {
  // 使用 useSortable 钩子获取拖拽相关属性和方法
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  // 拖拽样式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 跟踪鼠标悬停状态
  const [isHovered, setIsHovered] = useState(false);

  // 渲染拖拽手柄
  const renderDragHandle = (isHovered) => {
    const [showMenu, setShowMenu] = useState(false);
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

    return (
      <Popover.Root open={showMenu} onOpenChange={setShowMenu}>
        <Popover.Trigger asChild>
          <div 
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-6 transition-opacity drag-handle cursor-pointer z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
            sideOffset={5}
          >
            <div className="mb-1 text-xs text-gray-500 font-medium px-2">块操作</div>
            {blockTypeOptions.map((option) => (
              <button
                key={option.type}
                className={`flex items-center gap-2 px-2 py-1 rounded text-left ${option.type === 'delete' ? 'text-red-600 hover:bg-red-50' : 'hover:bg-gray-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onBlockMenuClicked(option.type, id);
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

  return (
    <div ref={setNodeRef} style={style} className={`${className} ${isDragging ? 'dragging' : ''}`}>
      <SimpleBlock
        id={id}
        content={content}
        onChange={(newContent) => onChange(id, newContent)}
        onBlockMenuClicked={onBlockMenuClicked}
        type={type}
        className={className}
        showClickedMenu={true}
        renderDragHandle={renderDragHandle}
        isDark={isDark}
        showFormatMenu={showFormatMenu}
      />
    </div>
  );
};

/**
 * SortableHeadingBlock - 可拖拽的标题块组件
 * 
 * 在SortableBlock的基础上，特化为标题块（具有特定样式和行为）
 */
export const SortableHeadingBlock = ({
  id,
  content,
  onChange,
  onBlockMenuClicked,
  className = '',
}) => {
  return (
    <SortableBlock
      id={id}
      content={content}
      onChange={onChange}
      onBlockMenuClicked={onBlockMenuClicked}
      type="heading"
      className={`mb-4 ${className}`}
    />
  );
};

/**
 * SortableParagraphBlock - 可拖拽的段落块组件
 * 
 * 在SortableBlock的基础上，特化为段落块
 */
export const SortableParagraphBlock = ({
  id,
  content,
  onChange,
  onBlockMenuClicked,
  className = '',
}) => {
  return (
    <SortableBlock
      id={id}
      content={content}
      onChange={onChange}
      onBlockMenuClicked={onBlockMenuClicked}
      type="paragraph"
      className={className}
    />
  );
};

/**
 * SortableThreeColumnBlock - 可拖拽的三列布局块组件
 * 
 * 创建一个包含三个并排编辑区域的块
 */
export const SortableThreeColumnBlock = ({
  id,
  contents = ['<p>左侧内容</p>', '<p>中间内容</p>', '<p>右侧内容</p>'],
  onChange,
  onBlockMenuClicked,
  className = '',
}) => {
  // 处理每个列的内容变化
  const handleColumnChange = (columnIndex, newContent) => {
    console.log(`Column ${columnIndex} changed to:`, newContent);
    if (onChange) {
      // 创建更新后的内容数组
      const updatedContents = [...contents];
      updatedContents[columnIndex] = newContent;
      
      console.log("Updated contents:", updatedContents);
      // 调用父级的onChange回调
      onChange(id, updatedContents);
    }
  };
  
  // 使用useSortable钩子获取拖拽相关属性
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  // 拖拽样式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  
  // 渲染拖拽手柄
  const renderDragHandle = (isHovered) => {
    const [showMenu, setShowMenu] = useState(false);
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

    return (
      <Popover.Root open={showMenu} onOpenChange={setShowMenu}>
        <Popover.Trigger asChild>
          <div 
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-6 transition-opacity drag-handle cursor-pointer z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
            sideOffset={5}
          >
            <div className="mb-1 text-xs text-gray-500 font-medium px-2">块操作</div>
            {blockTypeOptions.map((option) => (
              <button
                key={option.type}
                className={`flex items-center gap-2 px-2 py-1 rounded text-left ${option.type === 'delete' ? 'text-red-600 hover:bg-red-50' : 'hover:bg-gray-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onBlockMenuClicked(option.type, id);
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
  
  // 跟踪鼠标悬停状态
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderDragHandle(isHovered)}
      
      <div className="flex flex-row space-x-4 justify-between p-2 rounded transition-colors group">
        {/* 左列 */}
        <div className="flex-1 min-w-0 border-r pr-2">
          <SimpleBlock
            id={`${id}-column-0`}
            content={contents[0] || '<p></p>'}
            onChange={(content) => handleColumnChange(0, content)}
            type="paragraph"
            showClickedMenu={false}
          />
        </div>
        
        {/* 中列 */}
        <div className="flex-1 min-w-0 border-r pr-2">
          <SimpleBlock
            id={`${id}-column-1`}
            content={contents[1] || '<p></p>'}
            onChange={(content) => handleColumnChange(1, content)}
            type="paragraph"
            showClickedMenu={false}
          />
        </div>
        
        {/* 右列 */}
        <div className="flex-1 min-w-0">
          <SimpleBlock
            id={`${id}-column-2`}
            content={contents[2] || '<p></p>'}
            onChange={(content) => handleColumnChange(2, content)}
            type="paragraph"
            showClickedMenu={false}
          />
        </div>
      </div>
    </div>
  );
};
