'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Plus, X } from 'lucide-react';
import EditableField from './common/EditableField';

export const ProjectsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { projects } = resumeData;
  
  // State for project items
  const [projectItems, setProjectItems] = useState([...projects]);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addProject 
      });
    }
  }, []);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...projectItems];
    
    // 特殊处理 isPresent 字段
    if (field === 'isPresent') {
      newItems[index] = {
        ...newItems[index],
        isPresent: value === 'true' || value === true,
        // 如果是进行中的项目，清空结束日期
        toDate: value === 'true' || value === true ? '' : newItems[index].toDate
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    
    setProjectItems(newItems);
    
    // Update in context
    updateResumeField('projects', newItems);
  };
  
  // Add a new project entry
  const addProject = () => {
    const newItems = [
      ...projectItems,
      {
        title: "",
        description: "",
        fromDate: "",
        toDate: "",
        isPresent: false
      }
    ];
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  // Remove a project entry
  const removeProject = (index) => {
    const newItems = [...projectItems];
    newItems.splice(index, 1);
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-1">Projects</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-3" />
      
      {/* Project Items */}
      <div className="space-y-6">
        {projectItems.map((project, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-4 rounded-md group">
            <button 
              onClick={() => removeProject(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Project Title and Date Row - 三列均分布局 */}
            <div className="grid grid-cols-3 gap-2 items-center mb-1">
              {/* 项目名称 - 左侧 */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="title" 
                  placeholder="项目名称" 
                  className="inline-block font-medium"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 空白中间列，保持布局 */}
              <div className="text-center">
                {/* 可以根据需要添加其他字段，例如技术栈等 */}
              </div>
              
              {/* 日期 - 右侧 */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始日期" 
                  className="inline-block w-20 text-center"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                {project.isPresent ? (
                  <span className="inline-block w-20 text-center">至今</span>
                ) : (
                  <EditableField 
                    index={index} 
                    field="toDate" 
                    placeholder="结束日期" 
                    className="inline-block w-20 text-center"
                    value={projectItems}
                    onChange={handleFieldChange}
                  />
                )}
              </div>
            </div>
            
            {/* 进行中项目复选框 */}
            <div className="flex justify-end mb-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`isPresent-${index}`} 
                  checked={project.isPresent}
                  onChange={(e) => handleFieldChange(index, 'isPresent', e.target.checked)}
                  className="mr-1"
                />
                <label htmlFor={`isPresent-${index}`} className="text-sm">进行中项目</label>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-2">
              <EditableField 
                index={index} 
                field="description" 
                placeholder="项目描述（职责、技术、成果等）" 
                className="w-full"
                value={projectItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Add Project Button */}
            <button 
              onClick={addProject} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Project Button */}
      {!hideDefaultControls && projectItems.length === 0 && (
        <button 
          onClick={addProject}
          className="flex items-center mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> 添加项目经历
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
ProjectsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addProject } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加项目经历',
      action: addProject
    }
  ];
};

export default ProjectsSection;
