import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';
// import { useTranslation } from 'react-i18next';
import {Calendar, momentLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { Filter } from '../../components/timetable/list'
import { Subscription } from '../../components/timetable/list/Subscription';
import { cal } from '../../../helpers';

function Screen(props){
  // const { t } = useTranslation();
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [view, setView] = useState('month');
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
  }


  const onDone = async () => {
    setVisible(false);
    setSites([]);
    // let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
    // onSearch(query);
  }

  const localizer = momentLocalizer(moment)

  const handleViewChange = (view) => {
    setView(view)
  };

  const customFormats = {
    dayFormat: (date, culture, localizer) => 
      localizer.format(date, 'dddd', culture) === 'Monday' ? 'Даваа ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Tuesday' ? 'Мягмар ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Wednesday' ? 'Лхагва ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Thursday' ? 'Пүрэв ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Friday' ? 'Баасан ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Saturday' ? 'Бямба ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Sunday' ? 'Ням ' + localizer.format(date, 'MM/DD', culture) : '',
    timeGutterFormat: 'HH:mm',
    dayHeaderFormat: (date, culture, localizer) => 
      localizer.format(date, 'dddd', culture) === 'Monday' ? 'Даваа ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Tuesday' ? 'Мягмар ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Wednesday' ? 'Лхагва ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Thursday' ? 'Пүрэв ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Friday' ? 'Баасан ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Saturday' ? 'Бямба ' + localizer.format(date, 'MM/DD', culture)
      : localizer.format(date, 'dddd', culture) === 'Sunday' ? 'Ням ' + localizer.format(date, 'MM/DD', culture) : '',   
  };

  const customMonthHeader = ({ label }) => {
    return (
      <span>{label === 'Mon' ? 'Даваа' : label === 'Tue' ? 'Мягмар' : label === 'Wed' ? 'Лхагва' : label === 'Thu' ? 'Пүрэв'
            : label === 'Fri' ? 'Баасан': label === 'Sat' ? 'Бямба': label === 'Sun' ? 'Ням' : ''}</span>
    )};

  const customToolbar = (toolbar) => {
      const { label } = toolbar;
      return (
        <div className="custom-toolbar">{view === 'day' ?  <span>{label}</span>: null}</div>
  )};

  const yourEventsArray = [
    // {
    //   title: 'Event 1',
    //   start: new Date(2024, 1, 1),
    //   end: new Date(2024, 1, 2),
    // },
    // Add more events as needed
  ];

  let filterProps = { onSearch: getData, size, setError, data, handleViewChange };
  const subProps = { visible, setVisible, sites, setSites, onDone };

  return (
    <div className='s_container_r'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' id='solve_lists'>
          <Filter {...filterProps} />
          <Calendar localizer={localizer} view={view} 
            // toolbar={null}
            // showAllDay={false}
            events={yourEventsArray}
            startAccessor="start"
            endAccessor="end"
            className='tm_bc_back'
            timeslots={4}
            step={15}
            views={['month', 'week', 'work_week', 'day']}
            onView={ handleViewChange}  
            formats={customFormats}
            components={{ 
              month: { 
                header: customMonthHeader,
              },
              toolbar: customToolbar,
            }}
          />
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable1 = withSizeHOC(Screen);