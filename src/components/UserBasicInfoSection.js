'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';

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
  
  // Editable field component
  const EditableField = ({ field, placeholder, className = '' }) => {
    // Use ref to maintain input reference
    const inputRef = useRef(null);
    
    return (
      <input
        ref={inputRef}
        type="text"
        value={userInfoState[field] || ''}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        //onBlur={() => handleFieldBlur(field)}
        placeholder={placeholder}
        className={`bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-center ${className}`}
      />
    );
  };
  
  return (
    <div className="w-full flex justify-center my-8 relative">
      <div className="text-center max-w-3xl w-full">
        {/* User's name - large and bold */}
        <div className="flex gap-2 justify-center mb-4">
          <EditableField 
            field="firstName" 
            placeholder="名" 
            className="text-4xl font-bold"
          />
          <EditableField 
            field="lastName" 
            placeholder="姓" 
            className="text-4xl font-bold"
          />
        </div>
        
        {/* Second line - contact info */}
        <div className="text-gray-700 mb-2 flex flex-wrap justify-center gap-x-2">
          <EditableField 
            field="location" 
            placeholder="所在地" 
            className="inline-block"
          />
          
          {userInfoState.location && userInfoState.email && (
            <span>|</span>
          )}
          
          <EditableField 
            field="email" 
            placeholder="邮箱" 
            className="inline-block"
          />
          
          {userInfoState.email && userInfoState.phoneNumber && (
            <span>|</span>
          )}
          
          <EditableField 
            field="phoneNumber" 
            placeholder="电话" 
            className="inline-block"
          />
          
          {userInfoState.phoneNumber && userInfoState.websiteOrOtherProfileURL && (
            <span>|</span>
          )}
          
          <EditableField 
            field="websiteOrOtherProfileURL" 
            placeholder="个人网站" 
            className="inline-block"
          />
        </div>
        
        {/* Third line - social profiles */}
        <div className="text-gray-700 flex justify-center gap-x-2">
          <EditableField 
            field="linkedInURL" 
            placeholder="LinkedIn" 
            className="inline-block"
          />
          
          {userInfoState.linkedInURL && userInfoState.githubURL && (
            <span>|</span>
          )}
          
          <EditableField 
            field="githubURL" 
            placeholder="GitHub" 
            className="inline-block"
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
