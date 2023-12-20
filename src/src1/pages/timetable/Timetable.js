import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';
// import { useTranslation } from 'react-i18next';
import TimeTable from 'react-timetable-events';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { Filter } from '../../components/timetable'
import { Subscription } from './Subscription';

function Screen(props){
  // const { t } = useTranslation();
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment()?.startOf('month'), moment()];
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query, null, dates);
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
    console.log(response)
    if(response?.code === 2000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
      setSites(response?.data);
    }
    else if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    // setFilter(query);
    // setFilter1(query1 ?? '');
  }

  // const renderHour = (hour, defaultAttributes, styles) => {
  //   return (
  //     <div {...defaultAttributes} key={hour}>
  //       {hour}h
  //     </div>
  //   );
  // }

  // const renderEvent = (e, defaultAttributes, styles) => {
  //   return (
  //     <div {...defaultAttributes} title={e.name} key={e.id}>
  //       <span className={styles.event_info}>[ {e.name} ]</span>
  //       <span className={styles.event_info}>
  //         {e.startTime.format("HH:mm")} - {e.endTime.format("HH:mm")}
  //       </span>
  //     </div>
  //   );
  // }

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    // let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
    // onSearch(query);
  }

  let filterProps = { onSearch: getData, size, setError };
  const subProps = { visible, setVisible, sites, setSites, onDone };

  return (
    <div className='s_container_r'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' id='solve_lists'>
          <Filter {...filterProps} />
          {/* <TimeTable events={data}
          renderHour={renderHour}
          renderEvent={renderEvent}
          hoursInterval={[7, 24]}
          timeLabel="Time :)"/> */}
          {/* <Calendar/> */}
          {/* <TimeTable 
            events={{
              monday: [
                {
                  id: 1,
                  name: "Custom Event 1",
                  type: "custom",
                  startTime: new Date("2018-02-23T12:30:00"),
                  endTime: new Date("2018-02-23T14:00:00"),
                },
              ],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
            }}
  style={{ height: '500px' }}/> */}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable1 = withSizeHOC(Screen);