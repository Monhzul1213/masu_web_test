import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '../../components/control';
import { Notification } from './Notification';
import { Document } from './Document';
import { getList } from '../../../services';
import { Overlay } from '../../../components/all';
import { Dashboard } from './Dashboard';
import { Update } from './Update';
import moment from 'moment';

function Screen(){
  const [tab, setTab] = useState('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notiData, setNotiData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
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
      response?.data?.versionhistory?.versionhistoryitem?.forEach(item => {
        if(item?.versionTitle !== "Шинэчлэлт") item.show = true;
      })
      setUpdateData(response?.data?.versionhistory?.versionhistoryitem?.sort((a, b) => moment(b.verisionDate).valueOf() - moment(a.verisionDate).valueOf()))
    }
    setLoading(false);
  };

  const headerProps = {tab, setTab};
  const notiProps = {data: notiData, error, loading, getData, updateData};
  const dashboardProps = {data: notiData}; 

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        <Header {...headerProps}/>
        {tab === 'review' ? <Dashboard {...dashboardProps}/> : 
        tab === 'setting' ? <Document/> :
        tab === 'notification' ? <Notification {...notiProps}/> :
        tab === 'lastUpdate' ? <Update {...notiProps}/> : ''}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Control = withSizeHOC(Screen);