import React from 'react';

import { Money } from '../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {

    const isEven = index % 2 === 1; 
    const rowStyle = {
      backgroundColor: isEven ? '#f5f5f5' : '#ffffff' 
    };

    return (
        <div key={index} className='inv_item' style={rowStyle}>
          <p className='inv_header1' style={{justifyContent: 'center'}}>{(index + 1)}</p>
          <p className='inv_header2'>{item?.invtName}</p>
          <p className='inv_header3' style={{justifyContent: 'center'}}>{item?.qty}</p>
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