'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import EditableField from './common/EditableField';

export const UserBasicInfoSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { userInfo } = resumeData;
  
  // State for user info
  const [userInfoState, setUserInfoState] = useState({...userInfo});
  // Keep track of changes that need to be synced to context
  const pendingUpdates = useRef({});
  
  // Sync local state with context state
  useEffect(() => {
    setUserInfoState({...userInfo});
  }, [userInfo]);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({});
    }
  }, []);
  
  // Handle changes to fields - only update local state
  const handleFieldChange = (field, value) => {
    // Update local state immediately for responsive UI
    setUserInfoState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Store the update in ref (doesn't cause re-render)
    pendingUpdates.current[field] = value;
  };
  
  // Update global context when field loses focus
  const handleFieldBlur = (field) => {
    // Get the value from the pendingUpdates ref
    const value = pendingUpdates.current[field];
    
    // Only update if there's a value to update
    if (value !== undefined) {
      // Update in context
      updateResumeField(`userInfo.${field}`, value);
      
      // Clear pending update for this field
      delete pendingUpdates.current[field];
    }
  };
  
  return (
    <div className="w-full flex justify-center my-2 relative">
      <div className="text-center max-w-3xl w-full">
        {/* User's name - large and bold */}
        <div className="flex gap-1 justify-center mb-1">
          <EditableField 
            field="firstName" 
            placeholder="名" 
            className="text-3xl font-bold text-center w-auto"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <EditableField 
            field="lastName" 
            placeholder="姓" 
            className="text-3xl font-bold text-center w-auto"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </div>
        
        {/* Second line - contact info */}
        <div className="text-gray-700 mb-1 flex flex-wrap justify-center items-center">
          <EditableField 
            field="location" 
            placeholder="所在地" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          
          {userInfoState.location && userInfoState.email && (
            <span className="mx-0.5">|</span>
          )}
          
          <EditableField 
            field="email" 
            placeholder="邮箱" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          
          {userInfoState.email && userInfoState.phoneNumber && (
            <span className="mx-0.5">|</span>
          )}
          
          <EditableField 
            field="phoneNumber" 
            placeholder="电话" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          
          {userInfoState.phoneNumber && userInfoState.websiteOrOtherProfileURL && (
            <span className="mx-0.5">|</span>
          )}
          
          <EditableField 
            field="websiteOrOtherProfileURL" 
            placeholder="个人网站" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </div>
        
        {/* Third line - social profiles */}
        <div className="text-gray-700 flex justify-center items-center">
          <EditableField 
            field="linkedInURL" 
            placeholder="LinkedIn" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          
          {userInfoState.linkedInURL && userInfoState.githubURL && (
            <span className="mx-0.5">|</span>
          )}
          
          <EditableField 
            field="githubURL" 
            placeholder="GitHub" 
            className="inline-block text-center w-auto px-0.5"
            value={userInfoState}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </div>
      </div>
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
UserBasicInfoSection.getMenuOptions = () => {
  return [];
};

export default UserBasicInfoSection;
