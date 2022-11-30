import React from 'react';
import { icons } from '../../../assets';

import { Check } from '../../all';

export function Item(props){
  const { item, checked, onCheck, lbl, onClick } = props;

  return (
    <div className='cat_item'>
      <Check checked={checked} onClick={() => onCheck(item?.categoryId, checked)} />
      <div className='cat_btn' onClick={() => onClick(item)}>
        {item?.icon
          ? <img className='cat_icon' alt={item?.categoryId} src={icons[item?.icon - 1]} />
          : <div className='cat_color' />
        }
        <div className='cat_side'>
          <p className='cat_title'>{item?.categoryName}</p>
          <p className='cat_text'>{item?.items ?? 0} {lbl}</p>
        </div>
      </div>
    </div>
  )
}