'use client';

import React from 'react';
import { useResume } from '../context/ResumeContext';

export const UserBasicInfoSection = () => {
  const { resumeData } = useResume();
  const { userInfo } = resumeData;
  
  return (
    <div className="w-full flex justify-center my-8">
      <div className="text-center max-w-3xl">
        {/* User's name - large and bold */}
        <h1 className="text-4xl font-bold mb-4">
          {userInfo.firstName} {userInfo.lastName}
        </h1>
        
        {/* Second line - contact info with separators */}
        <div className="text-gray-700 mb-2">
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
        </div>
        
        {/* Third line - social profiles */}
        <div className="text-gray-700">
          {userInfo.linkedInURL && (
            <span>{userInfo.linkedInURL}</span>
          )}
          
          {userInfo.linkedInURL && userInfo.githubURL && (
            <span className="mx-2">|</span>
          )}
          
          {userInfo.githubURL && (
            <span>{userInfo.githubURL}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBasicInfoSection;
