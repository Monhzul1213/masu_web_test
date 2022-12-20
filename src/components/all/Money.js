import React from 'react';
import { useSelector } from 'react-redux';

import { formatNumber } from '../../helpers';

export function Money(props){
  const { value, fontSize, decimal } = props;
  const user = useSelector(state => state.login?.user);

  return (
    <span>
      {formatNumber(value, decimal)}
      <span style={{ fontSize }}> {user?.msMerchant?.currency ?? ''}</span>
    </span>
  )
}