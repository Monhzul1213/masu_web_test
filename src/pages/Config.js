import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import '../css/config.css';
import { Card, Tab, AppModal } from '../components/config';

export function Config(){
  const [selectedKeys, setSelectedKeys] = useState(['additional']);
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let mode = searchParams?.get('mode');
    if(mode === 'is_first') setVisible(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setVisible(false);
    searchParams.delete('mode');
    setSearchParams(searchParams);
  }

  const modalProps = { visible, closeModal };
  const cardProps = { selectedKeys, setSelectedKeys };
  
  return (
    <div className='s_container'>
      {visible && <AppModal {...modalProps} />}
      <Card {...cardProps} />
      <div className='c_gap' />
      <Tab {...cardProps} />
    </div>
  )
}