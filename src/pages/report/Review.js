import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/report/receipt';
import { Graph } from '../../components/report/review';
import { getList } from '../../services';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('totalSalesAmt');
  const [period, setPeriod] = useState('D');
  const [filter, setFilter] = useState('');
  const [total, setTotal] = useState(null);
  const [data, setData] = useState(null);
  const [periodData, setPeriodData] = useState(t('report_review.periods'));
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment()?.startOf('month'), moment()];
      let query = '?BeginDate=' + dates[0]?.format('yyyy.MM.DD') + '&EndDate=' + dates[1]?.format('yyyy.MM.DD');
      getData(query, null, dates);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPeriods = dates => {
    let diff = dates[1]?.diff(dates[0], 'days');
    let newPeriod = period;
    if(diff === 0){
      setPeriodData(old => old?.map(item => { return {...item, disabled: item.value !== 'H'} }));
      newPeriod = 'H';
    } else {
      if(period === 'H') newPeriod = 'D';
      if(dates[1].isSame(dates[0], 'month')){
        if(period === 'M') newPeriod = 'D';
        setPeriodData(old => old?.map(item => { return {...item, disabled: item.value === 'H' || item.value === 'M' } }));
      } else {
        setPeriodData(old => old?.map(item => { return {...item, disabled: item.value === 'H'} }));
      }
    }
    setPeriod(newPeriod)
    return newPeriod;
  }

  const getData = async (query, q2, dates, period2) => {
    let period1 = dates ? setPeriods(dates) : period2;
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesSummary' + (query ?? '') + '&SearchPeriod=' + period1;
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
      setData(response?.data);
    }
    setLoading(false);
    setFilter(query);
  }

  const changePeriod = value => {
    setPeriod(value);
    getData(filter, null, null, value);
  }

  let filterProps = { onSearch: getData, size, setError };
  let graphProps = { tab, setTab, total, data, size, periodData, period, setPeriod: changePeriod };

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