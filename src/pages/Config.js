import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import '../css/config.css';
import { Card, Tab, AppModal } from '../components/config';

function Screen(props){
  const { size } = props;
  const [selectedKeys, setSelectedKeys] = useState(['additional']);
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let mode = searchParams?.get('mode');
    if(mode === 'is_first') setVisible(true);
    else {
      let tab = searchParams?.get('tab');
      if(tab) setSelectedKeys([tab]);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowMenu(size?.width >= 840)
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const closeModal = () => {
    setVisible(false);
    searchParams.delete('mode');
    setSearchParams(searchParams);
  }

  const modalProps = { visible, closeModal };
  const cardProps = { selectedKeys, setSelectedKeys };
  
  return (
    <div className='s_container_c'>
      {visible && <AppModal {...modalProps} />}
      {showMenu && <Card {...cardProps} />}
      {showMenu && <div className='c_gap' />}
      <div>
        <Tab {...cardProps} />
      </div>
    </div>
  )
}

const withSizeHOC = withSize();
export const Config = withSizeHOC(Screen);