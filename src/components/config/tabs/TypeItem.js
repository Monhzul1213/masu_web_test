import React from 'react';

import { DynamicTBIcon } from '../../all';

export function TypeItem(props){
  const { item, free, subscribe } = props;

  return (
    <div className='a_item'>
      <DynamicTBIcon className='t_item_icon' name={item?.icon} />
      <div className='a_item_text'>
        <p className='a_item_title'>{item?.title}</p>
        <p className='a_item_sub_title'>{item?.sub_title}</p>
      </div>
      <div className='t_free'>
        <p className='a_item_sub_title'>{item?.day} {free}</p>
      </div>
      <div className='t_btn_back'>
        <button className='t_item_subscribe'>{subscribe}</button>
      </div>
    </div>
  );
}

export function TypeItem2(props){
  const { item } = props;

  return (
    <div className='a_item'>
      <DynamicTBIcon className='t_item_icon' name={item?.icon} />
      <div className='a_item_text'>
        <p className='a_item_title'>{item?.title}</p>
        <p className='a_item_sub_title' id='t_sub'>{item?.sub_title}</p>
      </div>
      <button className='t_item_subscribe'>{item?.btn}</button>
    </div>
  );
}