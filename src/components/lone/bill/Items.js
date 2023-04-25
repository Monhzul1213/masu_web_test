import React from 'react';

import { Money } from '../../all';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    const service = (item?.serviceName ?? item?.serviceCode) + (item?.serviceDescr ? (', ' + item?.serviceDescr) : '');
    return (
      <div key={index} className='bl_item'>
        <div className='bl_item_row'>
          <p className='bl_header1'>{item?.invtName ?? item?.invtId}</p>
          <p className='bl_header2'>{item?.qty}</p>
          <p className='bl_header3'><Money value={item?.price} fontSize={12} /></p>
          <p className='bl_header4'><Money value={item?.amount} fontSize={12} /></p>
        </div>
        {item?.serviceCode ? <p className='bl_item_descr'>{service}</p> : null}
      </div>
    );
  }
  
  return (
    <div>{detail?.map(renderItem)}</div>
  );
}