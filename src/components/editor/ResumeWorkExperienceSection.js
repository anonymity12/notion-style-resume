import React from 'react';
import { SortableHeadingBlock } from './SortableBlock';
import { SortableTwoColumnBlock } from './SortableTwoColumnBlock';

/**
 * ResumeWorkExperienceSection - 简历工作经验部分组件
 * 
 * 包含一个带浅绿色背景的标题块和若干个工作经历的两列布局条目
 */
export const ResumeWorkExperienceSection = ({
  id,
  headingContent = '<h1>WORK EXPERIENCE</h1>',
  entries = [
    {
      id: `${id}-entry-1`,
      content: [
        `<div>
          <p><strong>TechCorp</strong></p>
          <p>New York, USA</p>
          <p>2020-01-01 - 2023-12-31</p>
        </div>`,
        `<div>
          <p><strong>Software Engineer</strong></p>
          <p>Developed backend services and APIs for enterprise-level applications.</p>
        </div>`
      ]
    },
    {
      id: `${id}-entry-2`,
      content: [
        `<div>
          <p><strong>DevWorks</strong></p>
          <p>San Francisco, USA</p>
          <p>2018-06-01 - 2019-12-31</p>
        </div>`,
        `<div>
          <p><strong>Junior Developer</strong></p>
          <p>Worked on front-end development and UI design for client projects.</p>
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
    <div className={`resume-work-experience-section ${className}`}>
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
      
      {/* 工作经历条目 - 使用两列布局 */}
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
 * 创建新的工作经验部分的辅助函数
 */
export const createWorkExperienceSection = (id = `work-exp-${Date.now()}`) => {
  return {
    id,
    type: 'work-experience-section',
    headingContent: '<h1>WORK EXPERIENCE</h1>',
    entries: [
      {
        id: `${id}-entry-1`,
        content: [
          `<div>
            <p><strong>公司名称</strong></p>
            <p>城市, 国家</p>
            <p>起始时间 - 结束时间</p>
          </div>`,
          `<div>
            <p><strong>职位名称</strong></p>
            <p>工作职责和成就描述...</p>
          </div>`
        ]
      }
    ]
  };
};
