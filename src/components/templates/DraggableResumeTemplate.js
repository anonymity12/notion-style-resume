import React, { useState, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Popover from '@radix-ui/react-popover';
import { GripVertical, ChevronUp, ChevronDown, Plus, Trash2, Save } from 'lucide-react';

// Import the section components
import { ResumePersonalInfoSection, createPersonalInfoSection } from '../editor/ResumePersonalInfoSection';
import { ResumeWorkExperienceSection, createWorkExperienceSection } from '../editor/ResumeWorkExperienceSection';
import { ResumeEducationSection, createEducationSection } from '../editor/ResumeEducationSection';
import { ResumeProjectSection, createProjectSection } from '../editor/ResumeProjectSection';
import { ResumeSkillsSection, createSkillsSection } from '../editor/ResumeSkillsSection';

// Wrapper component to make sections draggable
const DraggableSection = ({ id, section, index, onSectionChange, onHeadingChange, onEntryChange, onAddEntry, onRemoveEntry, onRemoveSection, onMoveUp, onMoveDown }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    marginBottom: '0.5rem',
  };

  // Render drag handle with menu options
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const renderSection = () => {
    switch (section.type) {
      case 'personal-info-section':
        return (
          <ResumePersonalInfoSection
            id={section.id}
            headingContent={section.headingContent}
            entries={section.entries}
            onHeadingChange={onHeadingChange}
            onEntryChange={onEntryChange}
            onBlockMenuClicked={(action, blockId) => {
              // Handle block menu actions
              if (action === 'delete' && blockId.includes('-entry-')) {
                const entryId = blockId;
                const entryIndex = section.entries.findIndex(entry => entry.id === entryId);
                if (entryIndex !== -1) {
                  onRemoveEntry(entryIndex);
                }
              }
            }}
            className="print-section"
          />
        );
      case 'work-experience-section':
        return (
          <ResumeWorkExperienceSection
            id={section.id}
            headingContent={section.headingContent}
            entries={section.entries}
            onHeadingChange={onHeadingChange}
            onEntryChange={onEntryChange}
            onBlockMenuClicked={(action, blockId) => {
              // Handle block menu actions
              if (action === 'delete' && blockId.includes('-entry-')) {
                const entryId = blockId;
                const entryIndex = section.entries.findIndex(entry => entry.id === entryId);
                if (entryIndex !== -1) {
                  onRemoveEntry(entryIndex);
                }
              }
            }}
            className="print-section"
          />
        );
      case 'education-section':
        return (
          <ResumeEducationSection
            id={section.id}
            headingContent={section.headingContent}
            entries={section.entries}
            onHeadingChange={onHeadingChange}
            onEntryChange={onEntryChange}
            onBlockMenuClicked={(action, blockId) => {
              // Handle block menu actions
              if (action === 'delete' && blockId.includes('-entry-')) {
                const entryId = blockId;
                const entryIndex = section.entries.findIndex(entry => entry.id === entryId);
                if (entryIndex !== -1) {
                  onRemoveEntry(entryIndex);
                }
              }
            }}
            className="print-section"
          />
        );
      case 'project-section':
        return (
          <ResumeProjectSection
            id={section.id}
            headingContent={section.headingContent}
            entries={section.entries}
            onHeadingChange={onHeadingChange}
            onEntryChange={onEntryChange}
            onBlockMenuClicked={(action, blockId) => {
              // Handle block menu actions
              if (action === 'delete' && blockId.includes('-entry-')) {
                const entryId = blockId;
                const entryIndex = section.entries.findIndex(entry => entry.id === entryId);
                if (entryIndex !== -1) {
                  onRemoveEntry(entryIndex);
                }
              }
            }}
            className="print-section"
          />
        );
      case 'skills-section':
        return (
          <ResumeSkillsSection
            id={section.id}
            headingContent={section.headingContent}
            entries={section.entries}
            onHeadingChange={onHeadingChange}
            onEntryChange={onEntryChange}
            onBlockMenuClicked={(action, blockId) => {
              // Handle block menu actions
              if (action === 'delete' && blockId.includes('-entry-')) {
                const entryId = blockId;
                const entryIndex = section.entries.findIndex(entry => entry.id === entryId);
                if (entryIndex !== -1) {
                  onRemoveEntry(entryIndex);
                }
              }
            }}
            className="print-section"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle with menu */}
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger asChild>
          <div 
            className={`absolute left-0 top-4 -translate-y-1/2 -ml-6 transition-opacity cursor-pointer z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(true);
            }}
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
              onClick={() => {
                onAddEntry();
                setMenuOpen(false);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>添加条目</span>
            </button>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-gray-100"
              onClick={() => {
                onMoveUp();
                setMenuOpen(false);
              }}
              disabled={index === 0}
            >
              <ChevronUp className="w-4 h-4" />
              <span>上移部分</span>
            </button>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-gray-100"
              onClick={() => {
                onMoveDown();
                setMenuOpen(false);
              }}
            >
              <ChevronDown className="w-4 h-4" />
              <span>下移部分</span>
            </button>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded text-left text-red-600 hover:bg-red-50"
              onClick={() => {
                onRemoveSection();
                setMenuOpen(false);
              }}
            >
              <Trash2 className="w-4 h-4" />
              <span>删除部分</span>
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {renderSection()}
    </div>
  );
};

/**
 * DraggableResumeTemplate - 可拖拽的简历模板组件
 * 
 * 使用dnd-kit实现拖拽功能，并集成各种控制功能到拖拽手柄菜单中
 */
export const DraggableResumeTemplate = ({
  initialSections = getDefaultSections(),
  onSave,
  className = '',
}) => {
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState(null);
  
  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移动距离后激活拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理修改某个部分的标题
  const handleHeadingChange = (sectionIndex, newContent) => {
    const newSections = [...sections];
    newSections[sectionIndex].headingContent = newContent;
    setSections(newSections);
  };

  // 处理修改某个部分的条目
  const handleEntryChange = (sectionIndex, entryIndex, newContent) => {
    const newSections = [...sections];
    newSections[sectionIndex].entries[entryIndex].content = newContent;
    setSections(newSections);
  };

  // 处理添加新条目
  const handleAddEntry = (sectionIndex) => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    const newEntryId = `${section.id}-entry-${section.entries.length + 1}`;

    // 根据部分类型创建不同的新条目
    let newEntry;
    switch (section.type) {
      case 'personal-info-section':
        newEntry = {
          id: newEntryId,
          content: '<p><strong>新条目：</strong>请输入内容</p>'
        };
        break;
      case 'work-experience-section':
      case 'education-section':
      case 'project-section':
        newEntry = {
          id: newEntryId,
          content: [
            '<div><p><strong>标题</strong></p><p>副标题</p><p>时间范围</p></div>',
            '<div><p><strong>详情标题</strong></p><p>详情内容...</p></div>'
          ]
        };
        break;
      case 'skills-section':
        newEntry = {
          id: newEntryId,
          content: '<p><strong>技能类别：</strong>技能列表</p>'
        };
        break;
      default:
        newEntry = {
          id: newEntryId,
          content: '<p>新条目</p>'
        };
    }

    newSections[sectionIndex].entries.push(newEntry);
    setSections(newSections);
  };

  // 处理删除条目
  const handleRemoveEntry = (sectionIndex, entryIndex) => {
    // 不允许删除最后一个条目
    const section = sections[sectionIndex];
    if (section.entries.length <= 1) return;

    const newSections = [...sections];
    newSections[sectionIndex].entries.splice(entryIndex, 1);
    setSections(newSections);
  };

  // 处理添加新部分
  const handleAddSection = (sectionType) => {
    let newSection;
    switch (sectionType) {
      case 'personal-info':
        newSection = createPersonalInfoSection();
        break;
      case 'work-experience':
        newSection = createWorkExperienceSection();
        break;
      case 'education':
        newSection = createEducationSection();
        break;
      case 'project':
        newSection = createProjectSection();
        break;
      case 'skills':
        newSection = createSkillsSection();
        break;
      default:
        return;
    }

    setSections([...sections, newSection]);
  };

  // 处理删除部分
  const handleRemoveSection = (sectionIndex) => {
    if (sections.length <= 1) return; // 保留至少一个部分
    const newSections = [...sections];
    newSections.splice(sectionIndex, 1);
    setSections(newSections);
  };

  // 拖拽事件处理
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex(section => section.id === active.id);
        const newIndex = sections.findIndex(section => section.id === over.id);
        
        return arrayMove(sections, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  // 转换为后端API格式
  const convertToApiFormat = () => {
    // 提取个人信息部分
    const personalSection = sections.find(section => section.type === 'personal-info-section');
    const personalInfo = personalSection?.entries || [];
    
    // 提取各个部分
    const workSections = sections.filter(section => section.type === 'work-experience-section');
    const educationSections = sections.filter(section => section.type === 'education-section');
    const projectSections = sections.filter(section => section.type === 'project-section');
    const skillsSections = sections.filter(section => section.type === 'skills-section');

    // 提取文本内容的辅助函数
    const extractText = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    };

    // 提取关键内容的辅助函数
    const extractInfo = (text, prefix) => {
      if (text.includes(prefix)) {
        return text.split(prefix)[1].trim();
      }
      return '';
    };

    // 提取名字
    const nameEntry = personalInfo.find(entry => extractText(entry.content).includes('姓名'));
    const fullName = nameEntry ? extractInfo(extractText(nameEntry.content), '姓名：') : '';
    const lastName = fullName.substring(0, 1);
    const firstName = fullName.substring(1);

    // 提取联系方式
    const contactEntry = personalInfo.find(entry => extractText(entry.content).includes('联系方式'));
    const contactText = contactEntry ? extractText(contactEntry.content) : '';
    const email = contactText.includes('邮箱:') ? contactText.split('邮箱:')[1].trim() : '';

    // 提取工作经历
    const workExperience = [];
    workSections.forEach(section => {
      section.entries.forEach(entry => {
        if (!Array.isArray(entry.content)) return;
        
        const leftCol = extractText(entry.content[0]);
        const rightCol = extractText(entry.content[1]);
        const companyLines = leftCol.split('\n');
        const companyName = companyLines[0].trim();
        const location = companyLines.length > 1 ? companyLines[1].trim() : '';
        const dateRange = companyLines.length > 2 ? companyLines[2].trim() : '';

        const jobLines = rightCol.split('\n');
        const jobTitle = jobLines[0].trim();
        const description = jobLines.slice(1).join('\n').trim();

        workExperience.push({
          companyName,
          jobTitle,
          description
        });
      });
    });

    // 提取教育经历
    const education = [];
    educationSections.forEach(section => {
      section.entries.forEach(entry => {
        if (!Array.isArray(entry.content)) return;
        
        const leftCol = extractText(entry.content[0]);
        const rightCol = extractText(entry.content[1]);
        const schoolLines = leftCol.split('\n');
        const institutionName = schoolLines[0].trim();
        const location = schoolLines.length > 1 ? schoolLines[1].trim() : '';
        const dateRange = schoolLines.length > 2 ? schoolLines[2].trim() : '';
        
        const cityCountry = location.split(',');
        const city = cityCountry[0]?.trim() || '';
        const country = cityCountry[1]?.trim() || '';

        const dateRangeParts = dateRange.split('-');
        const fromDate = dateRangeParts[0]?.trim() || '';
        const toDate = dateRangeParts[1]?.trim() || '';

        const eduLines = rightCol.split('\n');
        const fieldOfStudy = eduLines[0].trim();
        const gradeInfo = eduLines.length > 1 ? eduLines[1].trim() : '';
        const grade = gradeInfo.includes('GPA:') ? gradeInfo.split('GPA:')[1].trim().split('/')[0] : '';
        const description = eduLines.slice(2).join('\n').trim();

        education.push({
          institutionName,
          fieldOfStudy,
          degree: '学士', // 默认学位
          grade,
          city,
          country,
          fromDate,
          toDate,
          isPresent: toDate.includes('至今'),
          description
        });
      });
    });

    // 提取项目经历
    const projects = [];
    projectSections.forEach(section => {
      section.entries.forEach(entry => {
        if (!Array.isArray(entry.content)) return;
        
        const leftCol = extractText(entry.content[0]);
        const rightCol = extractText(entry.content[1]);
        const projectLines = leftCol.split('\n');
        const title = projectLines[0].trim();
        const projectType = projectLines.length > 1 ? projectLines[1].trim() : '';
        const dateRange = projectLines.length > 2 ? projectLines[2].trim() : '';
        
        const dateRangeParts = dateRange.split('-');
        const fromDate = dateRangeParts[0]?.trim() || '';
        const toDate = dateRangeParts[1]?.trim() || '';

        const roleLines = rightCol.split('\n');
        const projectRole = roleLines[0].trim();
        const description = roleLines.slice(1).join('\n').trim();

        projects.push({
          title,
          projectRole,
          city: '', // 项目通常不关联地点
          country: '',
          fromDate,
          toDate,
          isPresent: toDate.includes('至今'),
          description
        });
      });
    });

    // 提取技能
    const skills = [];
    skillsSections.forEach(section => {
      section.entries.forEach(entry => {
        const skillText = extractText(entry.content);
        const skillParts = skillText.split(':');
        if (skillParts.length > 1) {
          const skillItems = skillParts[1].split(',');
          skillItems.forEach(skill => {
            const trimmedSkill = skill.trim();
            if (trimmedSkill) {
              skills.push(trimmedSkill);
            }
          });
        }
      });
    });

    // 构建最终API数据
    return {
      resume_title: "我的简历",
      updated_resume: {
        userInfo: {
          firstName,
          lastName,
          email
        },
        workExperience,
        summary: "", // 目前没有summary部分
        education,
        skills,
        achievements: [], // 目前没有achievements部分
        project: projects,
        award: [], // 目前没有award部分
        certifications: [], // 目前没有certifications部分
        publications: [] // 目前没有publications部分
      }
    };
  };

  // 保存简历
  const handleSave = async () => {
    if (!onSave) return;
    
    const apiData = convertToApiFormat();
    onSave(apiData);
  };

  return (
    <div className={`draggable-resume-template ${className}`}>
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-family: 'Garamond', 'Times New Roman', serif;
            font-size: 10pt;
            line-height: 1.2;
          }
          
          .draggable-resume-template {
            width: 210mm;  /* A4 width */
            min-height: 297mm; /* A4 height */
            padding: 10mm; /* Reduced margin */
            box-sizing: border-box;
            background: white;
          }
          
          h1 {
            font-size: 12pt;
            margin: 1pt 0;
            font-weight: 600;
            color: #333;
          }
          
          .print-section {
            margin-bottom: 4pt;
          }
          
          .bg-green-100 {
            background-color: #e8f5e9 !important;
            padding: 1pt !important;
          }
          
          p {
            margin: 1pt 0;
          }
          
          strong {
            font-weight: 600;
          }
          
          .print-controls, .drag-handle {
            display: none !important;
          }
        }
        
        /* Screen styles */
        .draggable-resume-template {
          max-width: 210mm;  /* A4 width */
          margin: 0 auto;
          font-family: 'Garamond', 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.3;
        }
        
        .draggable-resume-template h1 {
          font-size: 14pt;
          margin: 4pt 0;
          font-weight: 600;
          line-height: 1.1;
        }
        
        .draggable-resume-template p {
          margin: 2pt 0;
        }
        
        .print-section .bg-green-100 {
          background-color: #e8f5e9;
          padding: 2pt;
          margin-bottom: 3pt;
        }
      `}</style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="resume-content bg-white shadow-md rounded p-6 mb-4">
          <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section, index) => (
              <DraggableSection
                key={section.id}
                id={section.id}
                section={section}
                index={index}
                onSectionChange={(newSection) => {
                  const newSections = [...sections];
                  newSections[index] = newSection;
                  setSections(newSections);
                }}
                onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
                onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
                onAddEntry={() => handleAddEntry(index)}
                onRemoveEntry={(entryIndex) => handleRemoveEntry(index, entryIndex)}
                onRemoveSection={() => handleRemoveSection(index)}
                onMoveUp={() => {
                  if (index > 0) {
                    const newSections = [...sections];
                    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                    setSections(newSections);
                  }
                }}
                onMoveDown={() => {
                  if (index < sections.length - 1) {
                    const newSections = [...sections];
                    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                    setSections(newSections);
                  }
                }}
              />
            ))}
          </SortableContext>

          {/* Drag overlay for active item */}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white shadow-lg rounded border border-blue-300 p-4 opacity-80">
                {sections.find(section => section.id === activeId)?.headingContent || 'Section'}
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>

      {/* Controls */}
      <div className="flex justify-between mb-6 print-controls">
        <div className="space-x-2">
          <button 
            onClick={() => handleAddSection('personal-info')}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            添加个人信息
          </button>
          <button 
            onClick={() => handleAddSection('work-experience')}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            添加工作经验
          </button>
          <button 
            onClick={() => handleAddSection('education')}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            添加教育经历
          </button>
          <button 
            onClick={() => handleAddSection('project')}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            添加项目经历
          </button>
          <button 
            onClick={() => handleAddSection('skills')}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            添加技能
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          保存简历
        </button>
      </div>
    </div>
  );
};

// 获取默认部分数据
function getDefaultSections() {
  return [
    createPersonalInfoSection(),
    createWorkExperienceSection(),
    createEducationSection(),
    createProjectSection(),
    createSkillsSection()
  ];
}

/**
 * 创建简历示例页面
 */
export const DraggableResumePage = () => {
  const [saveMessage, setSaveMessage] = useState(null);
  
  const handleSaveResume = async (resumeData) => {
    try {
      setSaveMessage({ type: 'info', text: '正在保存简历...' });
      
      console.log('Sending resume data to API:', resumeData);
      
      const response = await fetch('/api/save_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
      
      if (!response.ok) {
        throw new Error(`保存失败: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      setSaveMessage({ type: 'success', text: '简历保存成功！' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveMessage({ type: 'error', text: error.message });
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">简历编辑器</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              打印简历
            </button>
          </div>
        </div>
        
        {saveMessage && (
          <div 
            className={`mb-4 p-3 rounded ${
              saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
              saveMessage.type === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        
        <DraggableResumeTemplate onSave={handleSaveResume} />
      </div>
    </div>
  );
};
