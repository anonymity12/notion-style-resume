'use client';

import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Pencil, Check, GripVertical } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

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
      {/* Section DragHandle with Menu */}
      <div className="relative">
        <Popover.Root>
          <Popover.Trigger asChild>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 hover:opacity-100 opacity-50 transition-opacity cursor-pointer z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content 
              className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
              sideOffset={5}
            >
              <button
                className="flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEditing();
                }}
              >
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>保存个人信息</span>
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4" />
                    <span>编辑个人信息</span>
                  </>
                )}
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      
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
