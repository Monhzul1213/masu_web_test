import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter, Card, Header, List } from '../../components/report/receipt';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(1);
  const [filter, setFilter] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(filter);
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      // let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      let query = '?BeginDate=2022.01.01&EndDate=2022.12.31';
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSales' + (query ?? '');
    let headers = { merchantid: user?.merchantId };
    console.log(api);
    const response = await dispatch(getList(user, token, api, null, headers));
    console.log(response?.data);
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    setFilter(query);
  }

  let filterProps = { onSearch: getData, size, setError };
  let cardProps = { data, tab, setTab, size };
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Card {...cardProps} />
        <div className='rp_list'>
          <Header {...filterProps} />
          {data?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Receipt = withSizeHOC(Screen);