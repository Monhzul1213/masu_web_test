import React, { useState } from 'react';
import { Dropdown as AntDrop, Menu } from 'antd';

import { DynamicAIIcon } from './DynamicIcon';
import { Confirm } from './Confirm';

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

export function IconDropdown(props){
  const { Icon, className, data, d_value, disabled, onPress } = props;
  const [open, setOpen] = useState(false);

  const onClick = item => {
    if(onPress) onPress(item);
    else if(item?.confirmText) setOpen(item);
    else item?.onClick();
  }

  const confirm = async sure => {
    if(sure) open?.onClick();
    setOpen(false);
  }

  const menu = (
    <Menu>
      {data?.map((item, index) => {
        return (<Menu.Item key={index} onClick={() => onClick(item)} disabled={item?.disabled}>
          {item[d_value ?? 'label']}
        </Menu.Item>);
      })}
    </Menu>
  );

  const confirmProps = { open: open ? true : false, text: open?.confirmText, confirm };

  return (
    <>
    {open ? <Confirm {...confirmProps} /> : null}
    <AntDrop overlay={menu} disabled={disabled}>
      <button className={className} disabled={disabled}>
        {Icon}
      </button>
    </AntDrop>
    </>
  );
}