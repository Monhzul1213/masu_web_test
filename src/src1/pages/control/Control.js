import React, { useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';

import { Overlay } from '../../components/all/all_m';
import { Header } from '../../components/control';
import { Review } from '../../../pages/report';
import { Document } from './Document';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('review');


  const headerProps = {tab, setTab};

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        <Header {...headerProps}/>
        {tab === 'review' ? <Review/> : 
         tab === 'setting' ? <Document/> :
         ''}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Control = withSizeHOC(Screen);