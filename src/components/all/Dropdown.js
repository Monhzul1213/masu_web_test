import React from 'react';
import { Dropdown as AntDrop, Menu } from 'antd';

import { DynamicAIIcon } from './DynamicIcon';

export function Dropdown(props){
  const { label, className, data, d_value } = props;

  const menu = (
    <Menu>
      {data?.map((item, index) => {
        return (<Menu.Item key={index}>{item[d_value ?? 'label']}</Menu.Item>);
      })}
    </Menu>
  );

  return (
    <AntDrop overlay={menu}>
      <button className={className}>
        {label}
        <DynamicAIIcon name='AiFillCaretDown' className='select_icon' />
      </button>
    </AntDrop>
  );
}