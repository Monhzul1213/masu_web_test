import React from 'react';

export function Info(props){
  const { header } = props;

  return (
    <div className='inv_row1'>
      <p className='inv_info_h' style={{fontSize: 11}}>Нэхэмжлэгч</p>
      <p className='inv_info_h' style={{fontSize: 11}}>Төлөгч</p>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 11}}>Байгууллага:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.cashierName ?? 'Masu Pos ХХК'}</p>
      </div>
      <div style={{ display: 'flex' }} >
        <p className='inv_info' style={{fontSize: 11}}>Байгууллага:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.custName ?? '__________________'}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 11}}>Хаяг:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.address ?? 'СБД, Twin Tower II'}</p>
      </div>
      <div style={{ display: 'flex' }} >
        <p className='inv_info' style={{fontSize: 11}}>Хаяг:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.address ?? '__________________'}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 11}}>Утас:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.phone ?? '95082022'}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 11}}>Утас:</p>
        <p className='inv_info1' style={{fontSize: 11}}>{header?.custPhone ?? '__________________'}</p>
      </div>
    </div>
  );
}
