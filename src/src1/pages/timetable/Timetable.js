import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';
// import { useTranslation } from 'react-i18next';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../components/all/all_m';
import { Filter } from '../../components/timetable'

function Screen(props){
  // const { t } = useTranslation();
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');
  const [filter1, setFilter1] = useState('');
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
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    setFilter(query);
    setFilter1(query1 ?? '');
  }


  let filterProps = { onSearch: getData, size, setError, filter, filter1 };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='i_list_cont_z' id='solve_lists'>
          <Filter {...filterProps} />
          {/* <Calendar/> */}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Timetable = withSizeHOC(Screen);