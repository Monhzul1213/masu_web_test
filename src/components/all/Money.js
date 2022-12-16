import React from 'react';
import { useSelector } from 'react-redux';

import { formatNumber } from '../../helpers';

export function Money(props){
  const { className, value, fontSize, decimal } = props;
  const user = useSelector(state => state.login?.user);

  return (
    <p className={className}>
      {formatNumber(value, decimal)}
      <span style={{ fontSize }}>{user?.merchant?.currency ?? '₮'}</span>
    </p>
  )
}