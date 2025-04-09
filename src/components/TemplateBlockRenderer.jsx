import React from 'react';
import DOMPurify from 'dompurify'; // For sanitizing HTML to prevent XSS attacks

/**
 * Component to render template blocks with dynamic data
 * @param {Object} props
 * @param {Array} props.blocks - Array of template blocks
 * @param {Object} props.data - Resume data to populate into templates
 * @returns {JSX.Element} Rendered blocks
 */
const TemplateBlockRenderer = ({ blocks, data }) => {
  // Process a template string with data
  const processTemplate = (template, data) => {
    if (!template || !data) return template;
    
    // Replace ${path.to.property} with actual data
    return template.replace(/\${([^}]+)}/g, (match, path) => {
      try {
        // Navigate the data object based on the path
        const value = path.split('.').reduce((obj, key) => {
          // Handle array access (e.g., education[0])
          if (key.includes('[') && key.includes(']')) {
            const arrayName = key.split('[')[0];
            const index = parseInt(key.split('[')[1].split(']')[0]);
            return obj && obj[arrayName] ? obj[arrayName][index] : undefined;
          }
          return obj ? obj[key] : undefined;
        }, data);
        
        // Return the found value or empty string if undefined
        return value !== undefined ? value : '';
      } catch (error) {
        console.error(`Failed to resolve path: ${path}`, error);
        return ''; // Return empty string on error
      }
    });
  };

  // Process block content based on type
  const processBlockContent = (content, data) => {
    if (!content) return content;
    
    if (typeof content === 'string') {
      return processTemplate(content, data);
    } else if (Array.isArray(content)) {
      return content.map(item => processTemplate(item, data));
    }
    return content;
  };

  // Render HTML content safely
  const renderHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Render a block based on its type
  const renderBlock = (block) => {
    const { id, type, content, parentId } = block;
    
    // Process the content with data
    const processedContent = processBlockContent(content, data);
    
    switch (type) {
      case 'heading':
        return (
          <div key={id} id={id} className="block-heading">
            <div dangerouslySetInnerHTML={renderHTML(processedContent)} />
          </div>
        );
        
      case 'paragraph':
        return (
          <div key={id} id={id} className="block-paragraph">
            <div dangerouslySetInnerHTML={renderHTML(processedContent)} />
          </div>
        );
        
      case 'three-column':
        return (
          <div key={id} id={id} className="block-three-column">
            <div className="columns-container">
              {Array.isArray(processedContent) && processedContent.map((column, index) => (
                <div key={`${id}-col-${index}`} className="column">
                  <div dangerouslySetInnerHTML={renderHTML(column)} />
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'two-column':
        return (
          <div key={id} id={id} className="block-two-column">
            <div className="columns-container">
              {Array.isArray(processedContent) && processedContent.map((column, index) => (
                <div key={`${id}-col-${index}`} className="column">
                  <div dangerouslySetInnerHTML={renderHTML(column)} />
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div key={id} id={id} className={`block-${type}`}>
            <div dangerouslySetInnerHTML={renderHTML(typeof processedContent === 'string' ? processedContent : 'Unknown content type')} />
          </div>
        );
    }
  };

  // Build a tree structure of blocks
  const buildBlockTree = () => {
    // Group blocks by their parent
    const blocksByParent = {};
    
    blocks.forEach(block => {
      const parentId = block.parentId || 'root';
      if (!blocksByParent[parentId]) {
        blocksByParent[parentId] = [];
      }
      blocksByParent[parentId].push(block);
    });
    
    // Function to recursively render blocks and their children
    const renderBlockWithChildren = (blockId) => {
      const children = blocksByParent[blockId] || [];
      
      return children.map(block => {
        const rendered = renderBlock(block);
        
        // Check if this block has children
        if (blocksByParent[block.id]) {
          return (
            <div key={`container-${block.id}`} className="block-container">
              {rendered}
              <div className="block-children">
                {renderBlockWithChildren(block.id)}
              </div>
            </div>
          );
        }
        
        return rendered;
      });
    };
    
    return renderBlockWithChildren('root');
  };

  return (
    <div className="resume-blocks-container">
      {buildBlockTree()}
    </div>
  );
};

export default TemplateBlockRenderer;
