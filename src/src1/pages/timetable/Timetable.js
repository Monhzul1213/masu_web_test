import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { Subscription, BigCalendar } from '../../components/timetable/list';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [view, setView] = useState('week');
  const [min, setMin] = useState();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    // else {
    //   let dates = [moment()?.startOf('month'), moment()];
    //   let query = '?BeginDate=' + moment()?.startOf('week')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.endOf('week')?.format('yyyy.MM.DD');
    //   getData(query);
    // }
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
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
    console.log(response?.data, api)
    if(response?.code === 2000){
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
        let date = new Date(item?.schdDate).toLocaleDateString();
        let beginTime = moment(date + 'T' + item?.beginTime, 'DD.MM.YYYYTHH:mm').toDate();
        let endTime = moment(date + 'T' + item?.endTime, 'DD.MM.YYYYTHH:mm').toDate(); 
        datas.push({title: item?.serviceName, start: new Date(beginTime), end: new Date(endTime), item })
        setMin(beginTime)
      })
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

  const events1 = [
    {
      title: 'Event 1',
      start: new Date(2024, 0, 1, 10, 0),
      end: new Date(2024, 0, 1, 12, 0),
    },
    {
      title: 'Event 2',
      start: new Date(2024, 0, 2, 14, 0),
      end: new Date(2024, 0, 2, 16, 0),
    },
    // Add more events as needed
  ];

  const subProps = { visible, setVisible, sites, setSites, onDone };
  const calendarProps = { view, setView, handleViewChange, setData, datas, onSearch: getData, size, min, setError, data, events1}

  return (
    <div className='s_container_r'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' id='solve_lists'>
          <BigCalendar {...calendarProps}/>
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable1 = withSizeHOC(Screen);