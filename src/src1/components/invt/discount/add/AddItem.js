import React from 'react';
import { Switch } from 'antd';

export function AddItem(props){
  const { item, onCheck } = props;

  const onChange = e => onCheck(item?.label, e);

  return (
    <div className='a_item'>
      <div className='a_item_text'>
        <p className='a_item_title'>{item?.title}</p>
        <p className='a_item_sub_title'>{item?.sub_title}</p>
      </div>
      <div className='gap'/>
      <Switch className='a_item_check1' checked={item?.checked} onChange={onChange} />
    </div>
  )
}