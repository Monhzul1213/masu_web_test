import React, { useState } from 'react';

import '../css/config.css';
import { Card, Tab } from '../components/config';

export function Config(){
  const [selectedKeys, setSelectedKeys] = useState('additional');

  const cardProps = { selectedKeys, setSelectedKeys };
  
  return (
    <div className='s_container'>
      <Card {...cardProps} />
      <div className='c_gap' />
      <Tab {...cardProps} />
    </div>
  )
}