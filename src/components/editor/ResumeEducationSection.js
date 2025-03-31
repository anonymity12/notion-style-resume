import React from 'react';
import { SortableHeadingBlock } from './SortableBlock';
import { SortableTwoColumnBlock } from './SortableTwoColumnBlock';

/**
 * ResumeEducationSection - 简历教育经历部分组件
 * 
 * 包含一个带浅绿色背景的标题块和若干个教育经历的两列布局条目
 */
export const ResumeEducationSection = ({
  id,
  headingContent = '<h1>教育经历</h1>',
  entries = [
    {
      id: `${id}-entry-1`,
      content: [
        `<div>
          <p><strong>北京大学</strong></p>
          <p>北京, 中国</p>
          <p>2018-09 - 2022-07</p>
        </div>`,
        `<div>
          <p><strong>计算机科学与技术</strong></p>
          <p>GPA: 3.8/4.0</p>
          <p>相关课程：数据结构、算法设计、操作系统、计算机网络</p>
        </div>`
      ]
    }
  ],
  onHeadingChange,
  onEntryChange,
  onBlockMenuClicked,
  className = '',
}) => {
  return (
    <div className={`resume-education-section ${className}`}>
      {/* 标题块 - 浅绿色背景 */}
      <div className="mb-2">
        <SortableHeadingBlock
          id={`${id}-heading`}
          content={headingContent}
          onChange={(blockId, newContent) => {
            if (onHeadingChange) {
              onHeadingChange(newContent);
            }
          }}
          onBlockMenuClicked={(action, blockId) => {
            if (onBlockMenuClicked) {
              onBlockMenuClicked(action, blockId);
            }
          }}
          className="bg-green-100 py-1 px-2 text-sm"
        />
      </div>
      
      {/* 教育经历条目 - 使用两列布局 */}
      <div className="ml-2">
        <div className="space-y-1">
          {entries.map((entry, index) => (
            <SortableTwoColumnBlock
              key={entry.id}
              id={entry.id}
              content={entry.content}
              onChange={(entryId, newContent) => {
                if (onEntryChange) {
                  onEntryChange(index, newContent);
                }
              }}
              onBlockMenuClicked={onBlockMenuClicked}
              className="hover:bg-gray-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 创建新的教育经历部分的辅助函数
 */
export const createEducationSection = (id = `education-${Date.now()}`) => {
  return {
    id,
    type: 'education-section',
    headingContent: '<h1>教育经历</h1>',
    entries: [
      {
        id: `${id}-entry-1`,
        content: [
          `<div>
            <p><strong>学校名称</strong></p>
            <p>城市, 国家</p>
            <p>入学时间 - 毕业时间</p>
          </div>`,
          `<div>
            <p><strong>专业</strong></p>
            <p>GPA: </p>
            <p>相关课程：</p>
          </div>`
        ]
      }
    ]
  };
};
