'use client';

import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';

/**
 * 组件用于显示当前 resumeData 的 JSON 内容
 * 可以展开/折叠，方便调试和查看数据状态
 */
const DataDisplay = () => {
  const { resumeData } = useResume();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <button 
          onClick={toggleExpand}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
        >
          {isExpanded ? '收起' : '展开'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="overflow-auto bg-gray-800 text-green-400 p-4 rounded-md max-h-96">
          <pre className="text-xs font-mono">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
