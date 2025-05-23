'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Plus, X } from 'lucide-react';
import EditableField from './common/EditableField';

export const EducationSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { education } = resumeData;
  
  // State for education items
  const [educationItems, setEducationItems] = useState([...education]);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addEducation 
      });
    }
  }, []);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...educationItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setEducationItems(newItems);
    
    // Update in context
    updateResumeField(`education[${index}].${field}`, value);
  };
  
  // Add a new education entry
  const addEducation = () => {
    const newItems = [
      ...educationItems,
      {
        universityName: "",
        universityLocation: "",
        universityMajor: "",
        degree: "",
        fromDate: "",
        toDate: "",
        gpa: "",
        courses: ""
      }
    ];
    setEducationItems(newItems);
    updateResumeField('education', newItems);
  };
  
  // Remove an education entry
  const removeEducation = (index) => {
    const newItems = [...educationItems];
    newItems.splice(index, 1);
    setEducationItems(newItems);
    updateResumeField('education', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-1 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-0.5">Education</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      
      {/* Education Items */}
      <div className="space-y-1">
        {educationItems.map((edu, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-1 rounded-md group">
            <button 
              onClick={() => removeEducation(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* University and Date Row */}
            <div className="grid grid-cols-3 gap-1 items-center mb-0.5">
              {/* 学校名称 - 左侧 */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="universityName" 
                  placeholder="学校名称" 
                  className="inline-block"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 专业 - 居中 */}
              <div className="text-center">
                <EditableField 
                  index={index} 
                  field="universityMajor" 
                  placeholder="专业" 
                  className="inline-block text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 年份 - 右侧 */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始年份" 
                  className="inline-block w-16 text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束年份" 
                  className="inline-block w-16 text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Bullet Points */}
            <ul className="list-disc pl-5 space-y-1">
              {/* GPA if available */}
              <li>
                <div className="flex items-baseline">
                  <EditableField 
                    index={index} 
                    field="gpa" 
                    placeholder="GPA"
                    value={educationItems}
                    onChange={handleFieldChange}
                  />
                </div>
              </li>
              
              {/* Degree if available */}
              <li>
                <EditableField 
                  index={index} 
                  field="degree" 
                  placeholder="学位"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </li>
              
              {/* Courses if available */}
              <li>
                <div className="flex items-baseline w-full">
                  <EditableField 
                    index={index} 
                    field="courses" 
                    placeholder="课程"
                    value={educationItems}
                    onChange={handleFieldChange}
                    className="w-full"
                  />
                </div>
              </li>
            </ul>
            
            {/* Location if available */}
            <div className="mt-0.5 text-sm text-gray-600">
              <EditableField 
                index={index} 
                field="universityLocation" 
                placeholder="位置"
                value={educationItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Add Education Button */}
            <button 
              onClick={addEducation} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Education Button */}
      {!hideDefaultControls && educationItems.length === 0 && (
        <button 
          onClick={addEducation}
          className="flex items-center mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加教育经历
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
EducationSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addEducation } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加教育经历',
      action: addEducation
    }
  ];
};

export default EducationSection;
