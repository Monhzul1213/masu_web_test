import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '../../components/control';
import { Review } from '../../../pages/report';
import { Notification } from './Notification';
import { Document } from './Document';
import { getList } from '../../../services';
import { Overlay } from '../../../components/all';

function Screen(){
  const [tab, setTab] = useState('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notiData, setNotiData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();


  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'System/GetDashboardService'));
    if(response?.error){
      setError(response?.error);
    } else {
      setNotiData(response?.data?.notif?.notif?.sort((a, b) => b.createdDate - a.createdDate))
      console.log(response);
    }
    setLoading(false);
  };

  const headerProps = {tab, setTab};
  const notiProps = {data: notiData, error, loading, getData, unreadCount};

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        <Header {...headerProps}/>
        { tab === 'review' ? <Review/> : 
        tab === 'setting' ? <Document/> :
        tab === 'notification' ? <Notification {...notiProps}/> :
        ''}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Control = withSizeHOC(Screen);