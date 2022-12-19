import React from 'react';
import { Switch } from 'antd';

export function Item(props){
  const { item, more, onCheck } = props;

  const onChange = e => onCheck(item?.label, e);

  return (
    <div className='a_item'>
      <div className='a_item_text'>
        <p className='a_item_title'>{item?.title}1ddd</p>
        <p className='a_item_sub_title'>{item?.sub_title}<button className='a_item_more'>{more}</button></p>
      </div>
      <Switch className='a_item_check' checked={item?.checked} onChange={onChange} />
    </div>
  )
}