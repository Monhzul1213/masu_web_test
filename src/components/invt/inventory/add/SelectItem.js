import React from 'react';

export function SelectItem(props){
  const { item } = props;

  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.name ?? item?.descr}</p>
      <p className='cs_sku'>SKU {item?.sku ?? item?.invtId}</p>
    </div>
  );
}