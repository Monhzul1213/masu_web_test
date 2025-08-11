import React from 'react';
import { Switch } from 'antd';

export function SwitchLabel(props){
  const { value, setValue, label, disabled } = props;

  return (
    <div className='ac_lbl_back'>
      <p className='ac_lbl'>{label}</p>
      <Switch className='a_item_check' checked={value} onChange={setValue} disabled={disabled} />
    </div>
  )
}