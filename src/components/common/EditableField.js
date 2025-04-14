'use client';

import React, { useRef } from 'react';

/**
 * 通用的可编辑输入字段组件
 * 可用于单个对象的字段编辑或数组中对象的字段编辑
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.field - 字段名称
 * @param {number} [props.index] - 如果是数组，则为数组索引
 * @param {string} props.placeholder - 占位符文本
 * @param {string} [props.className] - 额外的CSS类名
 * @param {Object|Array} props.value - 当前值(对象或数组)
 * @param {Function} props.onChange - 值变化时的回调函数
 * @param {Function} [props.onBlur] - 失去焦点时的回调函数
 * @param {string} [props.type='text'] - 输入类型
 * @returns {JSX.Element} EditableField组件
 */
const EditableField = ({ 
  field, 
  index, 
  placeholder, 
  className = '', 
  value, 
  onChange, 
  onBlur,
  type = 'text' 
}) => {
  // 使用 ref 维持输入框引用
  const inputRef = useRef(null);
  
  // 处理值变化
  const handleChange = (e) => {
    const newValue = e.target.value;
    // 根据是否有索引决定回调参数
    if (index !== undefined) {
      onChange(index, field, newValue);
    } else {
      onChange(field, newValue);
    }
  };
  
  // 处理失去焦点
  const handleBlur = () => {
    if (onBlur) {
      if (index !== undefined) {
        onBlur(index, field);
      } else {
        onBlur(field);
      }
    }
  };
  
  // 获取当前值
  const getCurrentValue = () => {
    if (index !== undefined) {
      // 数组中的对象
      return value[index]?.[field] || '';
    } else {
      // 直接对象
      return value[field] || '';
    }
  };
  
  return (
    <input
      ref={inputRef}
      type={type}
      value={getCurrentValue()}
      onChange={handleChange}
      onBlur={onBlur ? handleBlur : undefined}
      placeholder={placeholder}
      className={`bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none ${className}`}
    />
  );
};

export default EditableField;
