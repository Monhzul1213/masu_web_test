import React from 'react';

import { CheckBtn } from '../../../all';

export function Item(props){
  const { item, index, onCheck, disabled } = props;

  const onClick = () => onCheck(index);

  return (
    <div className='role_item'>
      <CheckBtn checked={item?.checked} onClick={onClick} className='role_item_check' disabled={disabled} />
      <p className='role_item_text'>{item?.label}</p>
    </div>
  );
}