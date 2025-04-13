'use client';

import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Pencil, Check } from 'lucide-react';

export const UserBasicInfoSection = () => {
  const { resumeData, updateResumeField } = useResume();
  const { userInfo } = resumeData;
  
  // State for tracking editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for storing temporary edits before saving
  const [editData, setEditData] = useState({...userInfo});
  
  // Handle input changes
  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
  };
  
  // Save all changes to the resume context
  const saveChanges = () => {
    // Update each field in the resume context
    Object.keys(editData).forEach(field => {
      if (editData[field] !== userInfo[field]) {
        updateResumeField(`userInfo.${field}`, editData[field]);
      }
    });
    
    setIsEditing(false);
  };
  
  // Toggle editing mode
  const toggleEditing = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setEditData({...userInfo});
      setIsEditing(true);
    }
  };
  
  return (
    <div className="w-full flex justify-center my-8 relative">
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
      
      <div className="text-center max-w-3xl w-full">
        {/* User's name - large and bold */}
        {isEditing ? (
          <div className="flex gap-2 justify-center mb-4">
            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="text-4xl font-bold text-center border-b border-gray-300 focus:border-blue-500 outline-none w-1/3"
              placeholder="名"
            />
            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="text-4xl font-bold text-center border-b border-gray-300 focus:border-blue-500 outline-none w-1/3"
              placeholder="姓"
            />
          </div>
        ) : (
          <h1 className="text-4xl font-bold mb-4">
            {userInfo.firstName} {userInfo.lastName}
          </h1>
        )}
        
        {/* Second line - contact info */}
        <div className="text-gray-700 mb-2">
          {isEditing ? (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <input
                type="text"
                value={editData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="所在地"
              />
              <input
                type="email"
                value={editData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="邮箱"
              />
              <input
                type="tel"
                value={editData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="电话"
              />
              <input
                type="text"
                value={editData.websiteOrOtherProfileURL}
                onChange={(e) => handleChange('websiteOrOtherProfileURL', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="个人网站"
              />
            </div>
          ) : (
            <>
              {userInfo.location && (
                <span>{userInfo.location}</span>
              )}
              
              {userInfo.location && userInfo.email && (
                <span className="mx-2">|</span>
              )}
              
              {userInfo.email && (
                <span>{userInfo.email}</span>
              )}
              
              {userInfo.email && userInfo.phoneNumber && (
                <span className="mx-2">|</span>
              )}
              
              {userInfo.phoneNumber && (
                <span>{userInfo.phoneNumber}</span>
              )}
              
              {userInfo.phoneNumber && userInfo.websiteOrOtherProfileURL && (
                <span className="mx-2">|</span>
              )}
              
              {userInfo.websiteOrOtherProfileURL && (
                <span>{userInfo.websiteOrOtherProfileURL}</span>
              )}
            </>
          )}
        </div>
        
        {/* Third line - social profiles */}
        <div className="text-gray-700">
          {isEditing ? (
            <div className="flex gap-2 justify-center">
              <input
                type="text"
                value={editData.linkedInURL}
                onChange={(e) => handleChange('linkedInURL', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="LinkedIn"
              />
              <input
                type="text"
                value={editData.githubURL}
                onChange={(e) => handleChange('githubURL', e.target.value)}
                className="text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="GitHub"
              />
            </div>
          ) : (
            <>
              {userInfo.linkedInURL && (
                <span>{userInfo.linkedInURL}</span>
              )}
              
              {userInfo.linkedInURL && userInfo.githubURL && (
                <span className="mx-2">|</span>
              )}
              
              {userInfo.githubURL && (
                <span>{userInfo.githubURL}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBasicInfoSection;
