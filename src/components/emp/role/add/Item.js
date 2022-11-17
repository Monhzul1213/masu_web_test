import React from 'react';

import { CheckBtn } from '../../../all';

export function Item(props){
  const { item, index, onCheck } = props;

  const onClick = () => onCheck(index);

  return (
    <div className='role_item'>
      <CheckBtn checked={item?.checked === 'Y'} onClick={onClick} className='role_item_check' />
      <p className='role_item_text'>{item?.label}</p>
    </div>
  );
}