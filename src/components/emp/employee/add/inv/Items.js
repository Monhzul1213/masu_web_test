import React from 'react';

import { Money } from '../../../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    return (
      <div key={index} className='bo_item'>
        <p className='in_header1'>{'1'}</p>
        <p className='in_header2'>{item?.serviceName}</p>
        <p className='in_header3'><Money value={item?.amount} fontSize={13} currency='₮' /></p>
      </div>
    );
  }
  
  return (
    <div>{detail?.map(renderItem)}</div>
  );
}