import React from 'react';
import { Switch } from 'antd';

export function AddItem(props){
  const { label , label1, value, setValue} = props;


  return (
    <div className='a_item'>
      <div className='a_item_text'>
        <p className='a_item_title'>{label}</p>
        <p className='a_item_sub_title'>{label1}</p>
      </div>
      <div className='gap'/>
      <Switch className='a_item_check1' checked={value} onChange={setValue} />
    </div>
    
  )
}