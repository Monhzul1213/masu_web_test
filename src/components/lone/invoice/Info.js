import React from 'react';

export function Info(props){
  const { header } = props;

  return (
    <div className='inv_row1'>
      <p className='inv_info_h'>Нэхэмжлэгч</p>
      <p className='inv_info_h'>Төлөгч</p>

      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Байгууллага:</p>
        <p className='inv_info1'>{header?.cashierName}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Байгууллага:</p>
        <p className='inv_info1'>{header?.custName}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Хаяг:</p>
        <p className='inv_info1'>{header?.address}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Хаяг:</p>
        <p className='inv_info1'>{header?.custAddress}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Утас:</p>
        <p className='inv_info1'>{header?.phone}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p className='inv_info'>Утас:</p>
        <p className='inv_info1'>{header?.custPhone}</p>
      </div>
    </div>
  );
}
