import React from 'react';
import { SortableHeadingBlock } from './SortableBlock';
import { SortableTwoColumnBlock } from './SortableTwoColumnBlock';

/**
 * ResumeProjectSection - 简历项目经历部分组件
 * 
 * 包含一个带浅绿色背景的标题块和若干个项目经历的两列布局条目
 */
export const ResumeProjectSection = ({
  id,
  headingContent = '<h1>项目经历</h1>',
  entries = [
    {
      id: `${id}-entry-1`,
      content: [
        `<div>
          <p><strong>个人网站开发</strong></p>
          <p>个人项目</p>
          <p>2023-01 - 2023-03</p>
        </div>`,
        `<div>
          <p><strong>前端开发</strong></p>
          <p>使用React.js和Tailwind CSS开发响应式个人网站，实现了博客、作品集等功能。</p>
          <p>通过Next.js实现服务端渲染，提升了网站性能和SEO效果。</p>
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
    <div className={`resume-project-section ${className}`}>
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
      
      {/* 项目经历条目 - 使用两列布局 */}
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
 * 创建新的项目经历部分的辅助函数
 */
export const createProjectSection = (id = `project-${Date.now()}`) => {
  return {
    id,
    type: 'project-section',
    headingContent: '<h1>项目经历</h1>',
    entries: [
      {
        id: `${id}-entry-1`,
        content: [
          `<div>
            <p><strong>项目名称</strong></p>
            <p>项目类型</p>
            <p>起止时间</p>
          </div>`,
          `<div>
            <p><strong>担任角色</strong></p>
            <p>项目描述及职责...</p>
            <p>技术栈及成果...</p>
          </div>`
        ]
      }
    ]
  };
};
