import React from 'react';
import { Progress as AntProgress } from 'antd';

export function Progress(props){
  const { order, width } = props;

  const pending = order?.status === 0 || order?.status === 1;

  return (
    <div style={{width, marginTop: -5}}>
      <AntProgress
        percent={order?.percent}
        showInfo={false}
        strokeColor={pending ? '#4BAF4F' : '#b0b0b0'}
        trailColor='#f2f2f2' />
      <p className='po_percent'>{order?.receivedTotalQty} of {order?.totalQty}</p>
    </div>
  )
}