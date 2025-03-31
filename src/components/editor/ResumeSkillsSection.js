import React from 'react';
import { SortableHeadingBlock } from './SortableBlock';
import { SortableParagraphBlock } from './SortableBlock';

/**
 * ResumeSkillsSection - 简历技能部分组件
 * 
 * 包含一个带浅绿色背景的标题块和技能列表段落
 */
export const ResumeSkillsSection = ({
  id,
  headingContent = '<h1>专业技能</h1>',
  entries = [
    {
      id: `${id}-entry-1`,
      content: '<p><strong>编程语言：</strong>JavaScript, TypeScript, Python, Java</p>'
    },
    {
      id: `${id}-entry-2`,
      content: '<p><strong>前端技术：</strong>React, Vue, HTML5, CSS3, Tailwind CSS</p>'
    },
    {
      id: `${id}-entry-3`,
      content: '<p><strong>后端技术：</strong>Node.js, Express, Django, Spring Boot</p>'
    },
    {
      id: `${id}-entry-4`,
      content: '<p><strong>工具与平台：</strong>Git, Docker, AWS, Figma</p>'
    }
  ],
  onHeadingChange,
  onEntryChange,
  onBlockMenuClicked,
  className = '',
}) => {
  return (
    <div className={`resume-skills-section ${className}`}>
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
      
      {/* 技能条目 - 使用段落 */}
      <div className="ml-2">
        <div className="space-y-1">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="hover:bg-gray-50 rounded"
            >
              <SortableParagraphBlock
                id={entry.id}
                content={entry.content}
                onChange={(blockId, newContent) => {
                  if (onEntryChange) {
                    onEntryChange(index, newContent);
                  }
                }}
                onBlockMenuClicked={onBlockMenuClicked}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 创建新的技能部分的辅助函数
 */
export const createSkillsSection = (id = `skills-${Date.now()}`) => {
  return {
    id,
    type: 'skills-section',
    headingContent: '<h1>专业技能</h1>',
    entries: [
      {
        id: `${id}-entry-1`,
        content: '<p><strong>编程语言：</strong></p>'
      },
      {
        id: `${id}-entry-2`,
        content: '<p><strong>前端技术：</strong></p>'
      },
      {
        id: `${id}-entry-3`,
        content: '<p><strong>后端技术：</strong></p>'
      },
      {
        id: `${id}-entry-4`,
        content: '<p><strong>工具与平台：</strong></p>'
      }
    ]
  };
};
