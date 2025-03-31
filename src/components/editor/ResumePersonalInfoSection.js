import React from 'react';
import { SortableHeadingBlock } from './SortableBlock';
import { SortableParagraphBlock } from './SortableBlock';

/**
 * ResumePersonalInfoSection - 简历个人信息部分组件
 * 
 * 包含一个带浅绿色背景的标题块和若干个个人信息段落
 */
export const ResumePersonalInfoSection = ({
  id,
  headingContent = '<h1>个人信息</h1>',
  entries = [
    {
      id: `${id}-entry-1`,
      content: '<p><strong>姓名：</strong>张三</p>'
    },
    {
      id: `${id}-entry-2`,
      content: '<p><strong>联系方式：</strong>电话: 188-8888-8888 | 邮箱: zhangsan@example.com</p>'
    },
    {
      id: `${id}-entry-3`,
      content: '<p><strong>个人网站：</strong>https://example.com</p>'
    }
  ],
  onHeadingChange,
  onEntryChange,
  onBlockMenuClicked,
  className = '',
}) => {
  return (
    <div className={`resume-personal-info-section ${className}`}>
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
      
      {/* 个人信息条目 - 使用段落 */}
      <div className="ml-2">
        {entries.map((entry, index) => (
          <SortableParagraphBlock
            key={entry.id}
            id={entry.id}
            content={entry.content}
            onChange={(blockId, newContent) => {
              if (onEntryChange) {
                onEntryChange(index, newContent);
              }
            }}
            onBlockMenuClicked={(action, blockId) => {
              if (onBlockMenuClicked) {
                onBlockMenuClicked(action, blockId);
              }
            }}
            className="mb-2"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 创建新的个人信息部分的辅助函数
 */
export const createPersonalInfoSection = (id = `personal-info-${Date.now()}`) => {
  return {
    id,
    type: 'personal-info-section',
    headingContent: '<h1>个人信息</h1>',
    entries: [
      {
        id: `${id}-entry-1`,
        content: '<p><strong>姓名：</strong>请输入姓名</p>'
      },
      {
        id: `${id}-entry-2`,
        content: '<p><strong>联系方式：</strong>电话: | 邮箱: </p>'
      },
      {
        id: `${id}-entry-3`,
        content: '<p><strong>个人网站：</strong>https://</p>'
      }
    ]
  };
};
