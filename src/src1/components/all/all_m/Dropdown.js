import React from 'react';
import { Dropdown as AntDrop, Menu } from 'antd';
import { Select as AntSelect } from 'antd';
import { BsCheckLg } from 'react-icons/bs';

import { DynamicAIIcon } from './DynamicIcon';
const { Option } = AntSelect;

export function Dropdown(props){
  const { label, className, data, d_value, disabled } = props;

  const menu = (
    <Menu>
      {data?.map((item, index) => {
        return (<Menu.Item key={index}>{item[d_value ?? 'label']}</Menu.Item>);
      })}
    </Menu>
  );

  return (
    <AntDrop overlay={menu} disabled={disabled}>
      <button className={className} disabled={disabled}>
        {label}
        <DynamicAIIcon name='AiFillCaretDown' className='drop_icon' />
      </button>
    </AntDrop>
  );
}

export function IconDropdown(props){
  const { value, setValue, data, className, onHide, Icon, dropdownStyle, dropdownAlign } = props;
  
  const renderItem = (item, index) => {
    return (<Option key={index} value={item?.value}>{item.label}</Option>);
  }

  const onDropdownVisibleChange = show => {
    if(!show) onHide && onHide();
  }

  return (
    <AntSelect
      className={className}
      onChange={setValue}
      showSearch={false}
      value={value}
      mode='multiple'
      menuItemSelectedIcon={<BsCheckLg />}
      onDropdownVisibleChange={onDropdownVisibleChange}
      maxTagCount={0}
      dropdownStyle={dropdownStyle}
      dropdownAlign={dropdownAlign}
      showArrow={true}
      suffixIcon={<Icon />}
      maxTagPlaceholder=''>
      {data?.map(renderItem)}
    </AntSelect>
  );
}