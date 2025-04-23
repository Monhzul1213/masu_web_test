import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { BigCalendar } from '../../components/timetable/list';
import { Subscription } from '../../../components/management/adjust/list/Subscription';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [view, setView] = useState('week');
  const [filter,  setFilter] =   useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webAppointment !== 'Y') navigate({ pathname: '/' });
    else {
      let query = '?BeginDate=' + moment()?.startOf('week')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.endOf('week')?.format('yyyy.MM.DD');  
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1 , dates) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetSchedule' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
      setSites(response?.data);
    }
    else if(response?.error) setError(response?.error);
    else {
      let datas = [];
      response?.data?.forEach(item=> {
        let date = moment(item?.schdDate)?.format('YYYY.MM.DD')
        let beginTime = moment(date + 'T' + item?.beginTime, 'YYYY.MM.DDTHH:mm').toDate();
        let endTime = moment(date + 'T' + item?.endTime, 'YYYY.MM.DDTHH:mm').toDate(); 
        datas.push({title: item?.serviceName, start: beginTime, end: endTime, item })
      })
      setFilter(query)
      setDatas(datas)
      setData(response?.data);
      setLoading(false);
    }
  }


  const onDone = async () => {
    setVisible(false);
    setSites([]);
  }

  const handleViewChange = (view) => {
    setView(view)
  };

  const subProps = { visible, setVisible, sites, setSites, onDone };
  const calendarProps = { view, setView, handleViewChange, setData, datas, onSearch: getData, size, setError, data, filter}

  return (
    <div className='s_container_r'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' style={{marginTop: 10, overflowY: 'scroll', minWidth : 720}}>
          <BigCalendar {...calendarProps}/>
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable1 = withSizeHOC(Screen);