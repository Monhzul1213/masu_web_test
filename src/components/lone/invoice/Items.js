import React from 'react';

import { Money } from '../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    return (
        <div key={index} className='inv_item'>
          <p className='inv_header1' style={{justifyContent: 'center'}}>{(index + 1)}</p>
          <p className='inv_header2'>{item?.invtName}</p>
          <p className='inv_header3' style={{justifyContent: 'flex-end'}}>{item?.qty}</p>
          <p className='inv_header4' style={{justifyContent: 'flex-end'}}><Money value={item?.price} fontSize={11} currency='₮' /></p>
          <p className='inv_header5' style={{justifyContent: 'flex-end'}}><Money value={item?.amount} fontSize={11} currency='₮' /></p>
        </div>
    );
  }
  
  return (
    <div>
      {detail?.map(renderItem)}
    </div>
  );
}