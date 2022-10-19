import React from 'react';
import { Switch } from 'antd';

export function AdditionalItem(props){
  const { item, more, setChecked } = props;

  const onChange = e => {
    console.log('setchecked', e);
    // setChecked();
  }

  return (
    <div className='a_item'>
      <div className='a_item_text'>
        <p className='a_item_title'>{item?.title}</p>
        <p className='a_item_sub_title'>{item?.sub_title}<button className='a_item_more'>{more}</button></p>
      </div>
      <Switch className='a_item_check' checked={item?.checked} onChange={onChange} />
    </div>
  )
}