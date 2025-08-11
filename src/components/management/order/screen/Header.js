import React from 'react';

import { Progress } from '../list/Progress';

export function Header(props){
  const { order } = props;

  let color = order?.status === 0 ? 'var(--danger-color)' : order?.status === 1 ? 'var(--text-color)' : 'var(--text2-color)';
  const style = { color };

  return (
    <div className='ps_header_back'>
      <div className='ps_header_side'>
        <p className='ps_header_no'>{order?.orderNo}</p>
        <p className='ps_header_status' style={style}>{order?.statusName}</p>
      </div>
      <Progress order={order} width={140} />
    </div>
  );
}