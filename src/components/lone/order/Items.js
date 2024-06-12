import React from 'react';

import { Money } from '../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    return (
      <div key={index} className='bo_item'>
        <p className='bo_header1'>{item?.invtName ?? item?.invtId}</p>
        <p className='bo_header2'>{item?.barCode}</p>
        <p className='bo_header3'>{item?.orderTotalQty}</p>
        <p className='bo_header4'><Money value={item?.cost} fontSize={13} currency='₮' /></p>
        <p className='bo_header5'><Money value={item?.totalCost} fontSize={13} currency='₮' /></p>
      </div>
    );
  }
  
  return (
    <div>{detail?.map(renderItem)}</div>
  );
}