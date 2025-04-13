'use client';

import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Pencil, Check, Plus, X } from 'lucide-react';

export const EducationSection = () => {
  const { resumeData, updateResumeField } = useResume();
  const { education } = resumeData;
  
  // State for tracking editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for storing temporary edits before saving
  const [editData, setEditData] = useState([...education]);
  
  // Handle input changes
  const handleChange = (index, field, value) => {
    const newEditData = [...editData];
    newEditData[index] = {
      ...newEditData[index],
      [field]: value
    };
    setEditData(newEditData);
  };
  
  // Save all changes to the resume context
  const saveChanges = () => {
    updateResumeField('education', editData);
    setIsEditing(false);
  };
  
  // Toggle editing mode
  const toggleEditing = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setEditData([...education]);
      setIsEditing(true);
    }
  };
  
  // Add a new education entry
  const addEducation = () => {
    setEditData([
      ...editData,
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
    ]);
  };
  
  // Remove an education entry
  const removeEducation = (index) => {
    const newEditData = [...editData];
    newEditData.splice(index, 1);
    setEditData(newEditData);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative">
      {/* Edit/Save Button */}
      <button 
        onClick={toggleEditing}
        className="absolute right-0 top-0 p-2 text-gray-500 hover:text-blue-500 transition-colors"
      >
        {isEditing ? (
          <Check className="w-5 h-5" />
        ) : (
          <Pencil className="w-5 h-5" />
        )}
      </button>
      
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-1">Education</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-3" />
      
      {/* Education Items */}
      {isEditing ? (
        <div className="space-y-6">
          {editData.map((edu, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-md relative mb-4">
              <button 
                onClick={() => removeEducation(index)} 
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* University and Date Row - Justified (same as viewing mode) */}
              <div className="flex justify-between items-center mb-3">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">学校名称, 专业</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={edu.universityName}
                      onChange={(e) => handleChange(index, 'universityName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder="学校名称"
                    />
                    <span>,</span>
                    <input
                      type="text"
                      value={edu.universityMajor}
                      onChange={(e) => handleChange(index, 'universityMajor', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder="专业"
                    />
                  </div>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">起止日期</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={edu.fromDate}
                      onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder="开始"
                    />
                    <span>–</span>
                    <input
                      type="text"
                      value={edu.toDate}
                      onChange={(e) => handleChange(index, 'toDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder="结束"
                    />
                  </div>
                </div>
              </div>
              
              {/* Bullet Points - mimic the list in viewing mode */}
              <div className="pl-5">
                <ul className="list-disc space-y-3">
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="min-w-[60px]">GPA:</span>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="GPA"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="min-w-[60px]">学位:</span>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleChange(index, 'degree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="学位"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start gap-2">
                      <span className="min-w-[60px] mt-2">课程:</span>
                      <input
                        type="text"
                        value={edu.courses}
                        onChange={(e) => handleChange(index, 'courses', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="课程"
                      />
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <input
                  type="text"
                  value={edu.universityLocation}
                  onChange={(e) => handleChange(index, 'universityLocation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="位置"
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={addEducation}
            className="flex items-center mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" /> 添加教育经历
          </button>
        </div>
      ) : (
        <>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              {/* University and Date Row - Justified */}
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">
                  {edu.universityName}
                  {edu.universityMajor && (
                    <span>, {edu.universityMajor}</span>
                  )}
                </div>
                <div className="text-right">
                  {edu.fromDate} – {edu.toDate}
                </div>
              </div>
              
              {/* Bullet Points */}
              <ul className="list-disc pl-5 space-y-1">
                {/* GPA if available */}
                {edu.gpa && (
                  <li>
                    GPA: {edu.gpa}
                  </li>
                )}
                
                {/* Degree if available */}
                {edu.degree && (
                  <li>
                    {edu.degree}
                  </li>
                )}
                
                {/* Courses if available */}
                {edu.courses && (
                  <li>
                    Coursework: {edu.courses}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default EducationSection;
