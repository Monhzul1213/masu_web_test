import React from 'react';

export function Progress(props){
  const { order, width } = props;

  const pending = order?.status === 0 || order?.status === 1;

  return (
    <div style={{ width }}>
      <div className='po_progress_back' style={{ width }}>
        <div className='po_progress' style={{ backgroundColor: pending ? '#4BAF4F' : '#b0b0b0', width: width * order?.percent / 100 }} />
      </div>
      <p className='po_percent'>{order?.receivedTotalQty} of {order?.totalQty}</p>
    </div>
  )
}