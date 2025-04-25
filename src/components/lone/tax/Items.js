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
          <p className='tax_header1' style={{justifyContent: 'center'}}>{(index + 1)}</p>
          <p className='tax_header2'>{item?.invtName}</p>
          <p className='tax_header6' style={{justifyContent: 'center'}}>{item?.barCode}</p>
          <p className='tax_header3' style={{justifyContent: 'flex-end'}}>{item?.qty}</p>
          <p className='tax_header4' style={{justifyContent: 'flex-end'}}><Money value={item?.price}  fontSize={11} currency='₮' /></p>
          <p className='tax_header5' style={{justifyContent: 'flex-end'}}><Money value={item?.amount} fontSize={11} currency='₮' /></p>
        </div>
    );
  }
  
  return (
    <div>
      {detail?.map(renderItem)}
    </div>
  );
}