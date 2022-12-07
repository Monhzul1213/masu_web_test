import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/report/receipt';
import { Graph } from '../../components/report/review';
import { getList } from '../../services';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState('D');
  const [filter, setFilter] = useState('');
  const [total, setTotal] = useState(null);
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

  const getData = async query => {
    console.log(query);
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesSummary' + (query ?? '') + '&SearchPeriod=' + period;
    console.log(api);
    const response = await dispatch(getList(user, token, api));
    console.log(response?.data);
    if(response?.error) setError(response?.error);
    else {
      let sales = 0, refund = 0, discount = 0, net = 0, profit = 0;
      response?.data?.forEach(item => {
        sales += item?.totalSalesAmt;
        refund += item?.totalReturnAmt;
        discount += item?.totalDiscAmt;
        net += item?.totalNetSalesAmt;
        profit += item?.totalProfitAmt;
      });
      setTotal({ sales, refund, discount, net, profit });
      // setData(response?.data);
      // tab === -1
      //   ? setFilteredData(response?.data)
      //   : setFilteredData(response?.data?.filter(item => item?.sale?.salesType === tab));
    }
    setLoading(false);
    setFilter(query);
  }
  
  let filterProps = { onSearch: getData, size, setError };
  let graphProps = { tab, setTab, total };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Graph {...graphProps} />
        {/* <Card {...cardProps} />
        <div className='rp_list'>
          <Header {...filterProps} />
          {filteredData?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div> */}
      </Overlay>
    </div>
  )
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);