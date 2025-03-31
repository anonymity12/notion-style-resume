import React, { useState } from 'react';
import { ResumePersonalInfoSection, createPersonalInfoSection } from '../editor/ResumePersonalInfoSection';
import { ResumeWorkExperienceSection, createWorkExperienceSection } from '../editor/ResumeWorkExperienceSection';
import { ResumeEducationSection, createEducationSection } from '../editor/ResumeEducationSection';
import { ResumeProjectSection, createProjectSection } from '../editor/ResumeProjectSection';
import { ResumeSkillsSection, createSkillsSection } from '../editor/ResumeSkillsSection';

/**
 * SimpleResumeTemplate - 简单的简历模板组件
 * 
 * 包含个人信息、工作经验、教育经历、项目经历和技能五个部分
 */
export const SimpleResumeTemplate = ({
  initialSections = getDefaultSections(),
  onSave,
  className = '',
}) => {
  const [sections, setSections] = useState(initialSections);

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
    const newSections = [...sections];
    newSections.splice(sectionIndex, 1);
    setSections(newSections);
  };

  // 处理上移部分
  const handleMoveUpSection = (sectionIndex) => {
    if (sectionIndex <= 0) return;
    const newSections = [...sections];
    [newSections[sectionIndex], newSections[sectionIndex - 1]] = 
      [newSections[sectionIndex - 1], newSections[sectionIndex]];
    setSections(newSections);
  };

  // 处理下移部分
  const handleMoveDownSection = (sectionIndex) => {
    if (sectionIndex >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[sectionIndex], newSections[sectionIndex + 1]] = 
      [newSections[sectionIndex + 1], newSections[sectionIndex]];
    setSections(newSections);
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

  // 渲染各个部分
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'personal-info-section':
        return (
          <div key={section.id} className="mb-6">
            <ResumePersonalInfoSection
              id={section.id}
              headingContent={section.headingContent}
              entries={section.entries}
              onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
              onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
              onBlockMenuClicked={(action, blockId) => handleBlockMenuAction(action, blockId, index)}
            />
            {renderSectionControls(index)}
          </div>
        );
      case 'work-experience-section':
        return (
          <div key={section.id} className="mb-6">
            <ResumeWorkExperienceSection
              id={section.id}
              headingContent={section.headingContent}
              entries={section.entries}
              onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
              onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
              onBlockMenuClicked={(action, blockId) => handleBlockMenuAction(action, blockId, index)}
            />
            {renderSectionControls(index)}
          </div>
        );
      case 'education-section':
        return (
          <div key={section.id} className="mb-6">
            <ResumeEducationSection
              id={section.id}
              headingContent={section.headingContent}
              entries={section.entries}
              onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
              onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
              onBlockMenuClicked={(action, blockId) => handleBlockMenuAction(action, blockId, index)}
            />
            {renderSectionControls(index)}
          </div>
        );
      case 'project-section':
        return (
          <div key={section.id} className="mb-6">
            <ResumeProjectSection
              id={section.id}
              headingContent={section.headingContent}
              entries={section.entries}
              onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
              onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
              onBlockMenuClicked={(action, blockId) => handleBlockMenuAction(action, blockId, index)}
            />
            {renderSectionControls(index)}
          </div>
        );
      case 'skills-section':
        return (
          <div key={section.id} className="mb-6">
            <ResumeSkillsSection
              id={section.id}
              headingContent={section.headingContent}
              entries={section.entries}
              onHeadingChange={(newContent) => handleHeadingChange(index, newContent)}
              onEntryChange={(entryIndex, newContent) => handleEntryChange(index, entryIndex, newContent)}
              onBlockMenuClicked={(action, blockId) => handleBlockMenuAction(action, blockId, index)}
            />
            {renderSectionControls(index)}
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染部分控制按钮
  const renderSectionControls = (sectionIndex) => {
    return (
      <div className="flex space-x-2 mt-2 justify-end">
        <button 
          onClick={() => handleAddEntry(sectionIndex)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
        >
          添加条目
        </button>
        <button 
          onClick={() => handleMoveUpSection(sectionIndex)}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
          disabled={sectionIndex === 0}
        >
          上移
        </button>
        <button 
          onClick={() => handleMoveDownSection(sectionIndex)}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
          disabled={sectionIndex === sections.length - 1}
        >
          下移
        </button>
        <button 
          onClick={() => handleRemoveSection(sectionIndex)}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
          disabled={sections.length <= 1}
        >
          删除
        </button>
      </div>
    );
  };

  // 处理块菜单操作
  const handleBlockMenuAction = (action, blockId, sectionIndex) => {
    // 找到该blockId属于哪个条目
    const section = sections[sectionIndex];
    const entryIndex = section.entries.findIndex(entry => entry.id === blockId);
    
    if (entryIndex !== -1) {
      if (action === 'delete') {
        handleRemoveEntry(sectionIndex, entryIndex);
      }
      // 其他操作可以在这里处理
    }
  };

  return (
    <div className={`simple-resume-template max-w-4xl mx-auto ${className}`}>
      {/* 简历内容 */}
      <div className="resume-content bg-white shadow-md rounded p-8 mb-6">
        {sections.map((section, index) => renderSection(section, index))}
      </div>

      {/* 底部控制区 */}
      <div className="flex justify-between mb-8">
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
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

// 创建简历示例页面
export const SimpleResumePage = () => {
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
        <h1 className="text-3xl font-bold mb-6 text-center">简历编辑器</h1>
        
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
        
        <SimpleResumeTemplate onSave={handleSaveResume} />
      </div>
    </div>
  );
};
