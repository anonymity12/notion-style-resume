'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Check } from 'lucide-react';
import { UserBasicInfoSection } from '../UserBasicInfoSection';
import * as Popover from '@radix-ui/react-popover';

export const SortableUserInfoBlock = ({ id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sectionState, setSectionState] = useState({
    isEditing: false,
    toggleEditing: null
  });

  // Setup sortable functionality with dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  // Apply drag styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 根据UserBasicInfoSection的状态获取菜单选项
  const getMenuOptions = () => {
    const { isEditing, toggleEditing } = sectionState;
    
    if (!toggleEditing) return [];
    
    return [
      {
        icon: isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />,
        label: isEditing ? '保存个人信息' : '编辑个人信息',
        action: toggleEditing
      }
    ];
  };

  // 处理来自UserBasicInfoSection的状态更新
  const handleMenuAction = (state) => {
    setSectionState(state);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative bg-white rounded-md mb-4 hover:shadow-md transition-shadow duration-200 ${isDragging ? 'z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle with Context Menu */}
      <Popover.Root open={showMenu} onOpenChange={setShowMenu}>
        <Popover.Trigger asChild>
          <div 
            className={`absolute left-0 top-8 -ml-6 transition-opacity duration-200 cursor-grab ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
            sideOffset={5}
          >
            {getMenuOptions().map((option, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  option.action();
                }}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      
      {/* Block Content */}
      <div className="p-4">
        <UserBasicInfoSection 
          hideDefaultControls={true} 
          onMenuAction={handleMenuAction}
        />
      </div>
    </div>
  );
};

export default SortableUserInfoBlock;
