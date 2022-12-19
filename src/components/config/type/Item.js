import React from 'react';

import { DynamicTBIcon } from '../../all';

export function Item1(props){
  const { item, free, subscribe } = props;

  return (
    <div className='co_t_item'>
      <DynamicTBIcon className='t_item_icon' name={item?.icon} />
      <div className='co_t_side'>
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
    </div>
  );
}

export function Item2(props){
  const { item, onClick } = props;

  return (
    <div className='co_t_item'>
      <DynamicTBIcon className='t_item_icon' name={item?.icon} />
      <div className='co_t_side'>
        <div className='a_item_text'>
          <p className='a_item_title'>{item?.title}</p>
          <p className='a_item_sub_title' id='t_sub'>{item?.sub_title}</p>
        </div>
        <div className='t_btn_back'>
          <button className='t_item_subscribe' onClick={e => onClick(e, item?.type)}>{item?.btn}</button>
        </div>
      </div>
    </div>
  );
}