import React from 'react';

import { Check } from '../../all';

export function Item(props){
  const { item, checked, onCheck, lbl, onClick } = props;

  return (
    <div className='cat_item'>
      <Check checked={checked} onClick={() => onCheck(item?.categoryId, checked)} />
      <div className='cat_btn' onClick={() => onClick(item)}>
        <div className='cat_color' style={{backgroundColor: item?.colorCode}} />
        <div className='cat_side'>
          <p className='cat_title'>{item?.categoryName}</p>
          <p className='cat_text'>{item?.items ?? 0} {lbl}</p>
        </div>
      </div>
    </div>
  )
}