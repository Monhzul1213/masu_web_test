import React from 'react';

import { Progress } from '../list/Progress';

export function Header(props){
  const { order } = props;

  return (
    <div className='ps_header_back'>
      <div className='ps_header_side'>
        <p className='ps_header_no'>{order?.orderNo}</p>
        <p className='ps_header_status'>{order?.statusName}</p>
      </div>
      <Progress order={order} />
    </div>
  );
}