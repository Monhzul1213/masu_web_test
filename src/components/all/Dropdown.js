import React, { useState } from 'react';
import { Dropdown as AntDrop, Menu } from 'antd';
import { Select as AntSelect } from 'antd';
import { BsCheckLg } from 'react-icons/bs';

import { DynamicAIIcon } from './DynamicIcon';
import { Confirm } from './Confirm';
const { Option } = AntSelect;

export function Dropdown(props){
  const { label, className, data, d_value, disabled } = props;
  const [open, setOpen] = useState(false);

  const onClick = item => {
    if(item?.confirmText) setOpen(item);
    else item?.onClick();
  }

  const confirm = async sure => {
    if(sure) open?.onClick();
    setOpen(false);
  }

  const menu = (
    <Menu>
      {data?.map((item, index) => {
        return (<Menu.Item key={index} onClick={() => onClick(item)} disabled={item?.disabled}>{item[d_value ?? 'label']}</Menu.Item>);
      })}
    </Menu>
  );

  const confirmProps = { open: open ? true : false, text: open?.confirmText, confirm };

  return (
    <>
    {open ? <Confirm {...confirmProps} /> : null}
    <AntDrop overlay={menu} disabled={disabled}>
      <button className={className} disabled={disabled}>
        {label}
        <DynamicAIIcon name='AiFillCaretDown' className='drop_icon' />
      </button>
    </AntDrop>
    </>
  );
}