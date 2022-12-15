import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../components/all/all_m';
import {Filter, Header, List } from '../../components/report/payment'
function Screen(props){
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
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesByPayments' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    console.log(api);
    const response = await dispatch(getList(user, token, api, null, headers));
    console.log(response?.data);
    if(response?.error) setError(response?.error);
    else {
      // setTotal({
      //   total: response?.data?.length,
      //   sales: response?.data?.filter(item => item?.sale?.salesType === 0).length,
      //   return: response?.data?.filter(item => item?.sale?.salesType === 1).length,
      // });
      setData(response?.data);
    }
    setLoading(false);
    setFilter(query);
    setFilter1(query1 ?? '');
  }



  let filterProps = { onSearch: getData, size, setError, filter, filter1 };
  let cardProps = { data, size, loading };
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <div className='rp_list_zz'>
          <Header {...filterProps} />
          {data?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const SalesPayment = withSizeHOC(Screen);