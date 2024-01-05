import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { Filter } from '../../components/timetable/list'
import { Subscription } from '../../components/timetable/list/Subscription';
import { Day } from '../../components/timetable/list/Day';
import { BigCalendar } from '../../components/timetable/list/Calendar';

function Screen(props){
  // const { t } = useTranslation();
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [view, setView] = useState('month');
  const [day, setDay] = useState(null);
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
    console.log(response?.data)
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

  const handleViewChange = (view) => {
    setView(view)
  };

  let filterProps = { onSearch: getData, size, setError, data, handleViewChange };
  const subProps = { visible, setVisible, sites, setSites, onDone };
  const calendarProps = { view, handleViewChange, day, setDay}

  return (
    <div className='s_container_r'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' id='solve_lists'>
          <Filter {...filterProps} />
          {/* <div className='tm_bc_back'> */}
            <BigCalendar {...calendarProps}/>
            {/* {view === 'day' && <Day day={day} setDay ={setDay} />} */}
          {/* </div> */}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable1 = withSizeHOC(Screen);