'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';
import { SimpleBlock } from './SimpleBlock';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * SortableBlock - 可拖拽的块组件
 * 
 * 该组件专注于处理拖拽功能，并将内容渲染委托给 SimpleBlock
 * 
 * Props:
 * - id: 块的唯一标识符（用于拖拽识别）
 * - content: 块的HTML内容
 * - onChange: 内容变更时的回调函数
 * - onAddBlock: 添加新块的回调函数
 * - type: 块类型（'heading' 或 'paragraph'）
 * - isActive: 是否处于激活状态
 * - isDark: 是否处于暗色模式
 * - children: 子组件
 * - showBlockMenu: 是否显示块菜单
 * - showFormatMenu: 是否显示格式菜单
 * - onDelete: 删除块的回调函数
 */
export const SortableBlock = ({
  id,
  content,
  onChange,
  onAddBlock,
  type = 'paragraph',
  isActive = false,
  isDark = false,
  children,
  showBlockMenu = true,
  showFormatMenu = true,
  onDelete,
  className = '',
  showAddMenu = true,
}) => {
  // 使用 useSortable 钩子获取拖拽相关属性和方法
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // 设置拖拽时的样式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : 'auto',
  };

  // 渲染拖拽手柄
  const renderDragHandle = (isHovered) => (
    <div 
      className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-6 transition-opacity drag-handle cursor-grab z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-4 h-4 text-gray-400" />
    </div>
  );

  return (
    <div ref={setNodeRef} style={style} className={`${className} ${isDragging ? 'dragging' : ''}`}>
      <SimpleBlock
        id={id}
        content={content}
        onChange={onChange}
        onAddBlock={onAddBlock}
        onDelete={onDelete}
        type={type}
        className={className}
        showAddMenu={true}
        renderDragHandle={renderDragHandle}
        isActive={isActive}
        isDark={isDark}
        showBlockMenu={showBlockMenu}
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
  onAddBlock,
  className = '',
}) => {
  return (
    <SortableBlock
      id={id}
      content={content}
      onChange={onChange}
      onAddBlock={onAddBlock}
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
  onAddBlock,
  className = '',
}) => {
  return (
    <SortableBlock
      id={id}
      content={content}
      onChange={onChange}
      onAddBlock={onAddBlock}
      type="paragraph"
      className={className}
    />
  );
};
