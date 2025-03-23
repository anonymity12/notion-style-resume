'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 初始数据
const initialItems = [
  { id: 'item-1', content: '项目 1' },
  { id: 'item-2', content: '项目 2' },
  { id: 'item-3', content: '项目 3' },
  { id: 'item-4', content: '项目 4' },
];

// 可排序项目组件
const SortableItem = ({ id, content }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 mb-3 bg-white border rounded-lg ${
        isDragging ? 'border-blue-500 shadow-lg opacity-75' : 'border-gray-200'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center">
        <div className="mr-3 text-gray-400">≡</div>
        <div>{content}</div>
        {isDragging && (
          <span className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            正在拖动
          </span>
        )}
      </div>
    </div>
  );
};

// 主组件
const SimpleDragDemo = () => {
  const [items, setItems] = useState(initialItems);
  
  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖动结束事件
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">简单拖拽演示 (DND Kit)</h1>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>提示:</strong> 点击并拖动任意项目来改变顺序。
        </p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[250px]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                content={item.content}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      
      <div className="mt-4 bg-gray-100 p-3 rounded-md">
        <h3 className="text-sm font-semibold mb-2">当前顺序:</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(items, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SimpleDragDemo;
