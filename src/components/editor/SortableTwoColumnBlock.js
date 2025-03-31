import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Popover from '@radix-ui/react-popover';
import { GripVertical, Heading1, Text, Columns2, Columns3, Trash2 } from 'lucide-react';
import { SimpleBlock } from './SimpleBlock';

/**
 * SortableTwoColumnBlock - 可拖拽的两列布局块组件
 * 
 * 创建一个包含两个编辑区域的块，专为简历内容设计：
 * - 左侧列占1/4宽度，用于标题、时间、地点等
 * - 右侧列占3/4宽度，用于内容详情等
 */
export const SortableTwoColumnBlock = ({
  id,
  content = [
    '<div><p><strong>公司/学校名称</strong></p><p>城市, 国家</p><p>起止时间</p></div>', 
    '<div><p><strong>职位/学位</strong></p><p>详细描述内容...</p></div>'
  ],
  onChange,
  onBlockMenuClicked,
  className = '',
}) => {
  // 处理每个列的内容变化
  const handleColumnChange = (columnIndex, newContent) => {
    console.log(`Column ${columnIndex} changed to:`, newContent);
    if (onChange) {
      // 创建更新后的内容数组
      const updatedContents = [...content];
      updatedContents[columnIndex] = newContent;
      
      console.log("Updated content:", updatedContents);
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
        icon: <Columns2 className="w-4 h-4" />,
        label: '两列布局',
        type: 'two-column'
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
      className={`relative hover:outline hover:outline-1 hover:outline-gray-200 rounded ${className}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 渲染拖拽手柄 */}
      {renderDragHandle(isHovered)}

      {/* 两列布局 */}
      <div className="flex flex-row space-x-2 justify-between p-1 rounded transition-colors group">
        {/* 左侧列 - 占比1 */}
        <div className="w-1/4 min-w-0 border-r pr-1">
          <SimpleBlock
            id={`${id}-column-0`}
            content={content[0] || '<p></p>'}
            onChange={(content) => {
              handleColumnChange(0, content);
            }}
            type="paragraph"
            showClickedMenu={false}
          />
        </div>
        {/* 右侧列 - 占比3 */}
        <div className="w-3/4 min-w-0">
          <SimpleBlock
            id={`${id}-column-1`}
            content={content[1] || '<p></p>'}
            onChange={(content) => {
              handleColumnChange(1, content);
            }}
            type="paragraph"
            showClickedMenu={false}
          />
        </div>
      </div>
    </div>
  );
};
