'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Plus, X } from 'lucide-react';

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
  
  // Editable field component
  const EditableField = ({ index, field, placeholder, className = '' }) => {
    return (
      <input
        type="text"
        value={educationItems[index][field] || ''}
        onChange={(e) => handleFieldChange(index, field, e.target.value)}
        placeholder={placeholder}
        className={`bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none ${className}`}
      />
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-1">Education</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-3" />
      
      {/* Education Items */}
      <div className="space-y-6">
        {educationItems.map((edu, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-4 rounded-md group">
            <button 
              onClick={() => removeEducation(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* University and Date Row */}
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium flex items-baseline">
                <EditableField 
                  index={index} 
                  field="universityName" 
                  placeholder="学校名称" 
                  className="inline-block mr-1"
                />
                {edu.universityMajor && ", "}
                <EditableField 
                  index={index} 
                  field="universityMajor" 
                  placeholder="专业" 
                  className="inline-block"
                />
              </div>
              <div className="text-right flex items-center space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始年份" 
                  className="inline-block w-16 text-center"
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束年份" 
                  className="inline-block w-16 text-center"
                />
              </div>
            </div>
            
            {/* Bullet Points */}
            <ul className="list-disc pl-5 space-y-1">
              {/* GPA if available */}
              <li>
                <div className="flex items-baseline">
                  <span className="mr-1">GPA:</span>
                  <EditableField 
                    index={index} 
                    field="gpa" 
                    placeholder="GPA" 
                  />
                </div>
              </li>
              
              {/* Degree if available */}
              <li>
                <EditableField 
                  index={index} 
                  field="degree" 
                  placeholder="学位" 
                />
              </li>
              
              {/* Courses if available */}
              <li>
                <div className="flex items-baseline">
                  <span className="mr-1">Coursework:</span>
                  <EditableField 
                    index={index} 
                    field="courses" 
                    placeholder="课程" 
                  />
                </div>
              </li>
            </ul>
            
            {/* Location if available */}
            <div className="mt-2 text-sm text-gray-600">
              <EditableField 
                index={index} 
                field="universityLocation" 
                placeholder="位置" 
              />
            </div>
          </div>
        ))}
        
        {/* Add Education Button */}
        <button 
          onClick={addEducation}
          className="flex items-center mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> 添加教育经历
        </button>
      </div>
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
