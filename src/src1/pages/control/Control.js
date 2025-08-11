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
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
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
      const items = response?.data?.notif?.notifitem || [];
      const unread = items.filter(item => item.isShow === 'N').length;
      setUnreadCount(unread);
      const item1 = response?.data?.versionhistory?.versionhistoryitem;

      if (Array.isArray(item1) && item1.length > 0) {
        // Хугацааг moment-оор харьцуулахын тулд clone хийж авна
        const lastItem = item1.reduce((latest, item) => {
          const itemDate = moment(item.verisionDate, 'YYYY.MM.DD');
          const latestDate = moment(latest.verisionDate, 'YYYY.MM.DD');
          return itemDate.isAfter(latestDate) ? item : latest;
        });
      
        // Бүх show-уудыг false болгож, хамгийн сүүлийнхийг true болгоно
        item1.forEach(item => {
          item.show = item === lastItem;
        });
      }
      setUpdateData(
        item1.sort((a, b) => 
          moment(b.verisionDate, 'YYYY.MM.DD').valueOf() - moment(a.verisionDate, 'YYYY.MM.DD').valueOf()
        )
      );
      // setUpdateData(response?.data?.versionhistory?.versionhistoryitem?.sort((a, b) => moment(b.verisionDate).valueOf() - moment(a.verisionDate).valueOf()))
    }
    setLoading(false);
  };

  const headerProps = {tab, setTab, unreadCount};
  const notiProps = {data: notiData, error, loading, getData, updateData};
  const dashboardProps = {data: notiData}; 

  return (
    <div className='s_container_r' style={{maxWidth}}>
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