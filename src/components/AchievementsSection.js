'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Plus, X } from 'lucide-react';
import EditableField from './common/EditableField';

export const AchievementsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { achievements } = resumeData;
  
  // State for achievement items
  const [achievementItems, setAchievementItems] = useState([...achievements]);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addAchievement 
      });
    }
  }, []);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...achievementItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setAchievementItems(newItems);
    
    // Update in context
    updateResumeField('achievements', newItems);
  };
  
  // Add a new achievement entry
  const addAchievement = () => {
    const newItems = [
      ...achievementItems,
      {
        title: "",
        description: "",
        fromDate: "",
        toDate: ""
      }
    ];
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  // Remove an achievement entry
  const removeAchievement = (index) => {
    const newItems = [...achievementItems];
    newItems.splice(index, 1);
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-1">Achievements</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-3" />
      
      {/* Achievement Items */}
      <div className="space-y-6">
        {achievementItems.map((achievement, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-4 rounded-md group">
            <button 
              onClick={() => removeAchievement(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Achievement Title and Date Row - 三列均分布局 */}
            <div className="grid grid-cols-3 gap-2 items-center mb-1">
              {/* 成就名称 - 左侧 */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="title" 
                  placeholder="成就名称" 
                  className="inline-block font-medium"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 空白中间列，保持布局 */}
              <div className="text-center">
                {/* 可以根据需要添加其他字段 */}
              </div>
              
              {/* 日期 - 右侧 */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始日期" 
                  className="inline-block w-20 text-center"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束日期" 
                  className="inline-block w-20 text-center"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-2">
              <EditableField 
                index={index} 
                field="description" 
                placeholder="成就描述（证书、奖项、荣誉等）" 
                className="w-full"
                value={achievementItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Add Achievement Button */}
            <button 
              onClick={addAchievement} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Achievement Button */}
      {!hideDefaultControls && achievementItems.length === 0 && (
        <button 
          onClick={addAchievement}
          className="flex items-center mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> 添加成就经历
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
AchievementsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addAchievement } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加成就经历',
      action: addAchievement
    }
  ];
};

export default AchievementsSection;
