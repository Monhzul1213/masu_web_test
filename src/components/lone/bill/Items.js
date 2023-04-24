import React from 'react';

export function Items(props){
  const { detail } = props;

  const renderItem = (item, index) => {
    const service = (item?.serviceName ?? item?.serviceCode) + (item?.serviceDescr ? (', ' + item?.serviceDescr) : '');
    return (
      <div key={index} className='bl_item'>
        <div className='bl_item_row'>
          <p className='bl_item1'>{item?.invtName ?? item?.invtId}</p>
          <p className='bl_item2'>{item?.qty}</p>
          <p className='bl_item3'>{item?.price}</p>
          <p className='bl_item4'>{item?.amount}</p>
        </div>
        {item?.serviceCode ? <p className='bl_item_descr'>{service}</p> : null}
      </div>
    );
  }
  
  return (
    <div>
      {detail?.map(renderItem)}
    </div>
  );
}