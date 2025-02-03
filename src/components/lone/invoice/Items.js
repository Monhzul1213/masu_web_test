import React from 'react';

import { Money } from '../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    return (
        <div key={index} className='inv_item'>
          <p className='inv_header1'>{(index + 1)}</p>
          <p className='inv_header2'>{item?.invtName}</p>
          <p className='inv_header3'>{item?.qty}</p>
          <p className='inv_header4'><Money value={item?.price} fontSize={13} currency='₮' /></p>
          <p className='inv_header5'><Money value={item?.amount} fontSize={13} currency='₮' /></p>
        </div>
    );
  }
  
  return (
    <div>
      {detail?.map(renderItem)}
    </div>
  );
}