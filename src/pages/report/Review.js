import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/report/receipt';
import { Graph, List } from '../../components/report/review';

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
  const [date, setDate] = useState([]);
  const [graphData, setGraphData] = useState(null);
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
    setPeriod(newPeriod);
    setDate(dates);
    return newPeriod;
  }
   
  const formatData = (data, period, date) => {
    let newData = [];
    if(period === 'D'){
      let diff = date[1]?.diff(date[0], 'days');
      if(diff <= 60){
        for (let index = 0; index <= diff; index++) {
          let salesDate = moment(date[0]).add(index, 'days')?.format('yyyy-MM-DDT00:00:00');
          let exists = data?.findIndex(res => salesDate === res?.salesDate);
          if(exists !== -1) newData.push(data[exists]);
          else newData.push({ salesDate, totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
        }
      } else newData = data;
    } else if(period === 'H'){
      for (let index = 0; index <= 23; index++) {
        let exists = data?.findIndex(res => index === res?.salesDate);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ salesDate: index > 10 ? index : ('0' + index),
          totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
      }
    } else if(period === 'W'){
      let start = moment(date[0]).startOf('isoWeek');
      while(start.isBefore(date[1])){
        let weekInterval = start.format('yyyy.MM.DD') + ' - ' + moment(start).endOf('isoWeek').format('yyyy.MM.DD');
        let exists = data?.findIndex(res => weekInterval === res?.weekInterval);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ weekInterval, totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
        start.add(7, 'days');
      }
    } else newData = data;
    return newData;
  }

  const getData = async (query, q2, dates, period2) => {
    let period1 = dates ? setPeriods(dates) : period2;
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesSummary' + (query ?? '') + '&SearchPeriod=' + period1;
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      let sales = 0, refund = 0, discount = 0, net = 0, profit = 0;
      response?.data?.forEach(item => {
        sales += item?.totalSalesAmt ?? 0;
        refund += item?.totalReturnAmt ?? 0;
        discount += item?.totalDiscAmt ?? 0;
        net += item?.totalNetSalesAmt ?? 0;
        profit += item?.totalProfitAmt ?? 0;
        if(period1 === 'H') item.label = item.salesDate + ':00';
        else if(period1 === 'D') item.label = moment(item.salesDate)?.format('yyyy.MM.DD');
        else if(period1 === 'W') item.label = item.weekInterval;
        else if(period1 === 'M') item.label = item.salesDate + t('page.month');
      });
      setTotal({ sales, refund, discount, net, profit });
      setData(response?.data);
      setGraphData(response?.data?.length ? formatData(response?.data, period1, dates ?? date) : []);
    }
    setLoading(false);
    setFilter(query);
  }

  const changePeriod = value => {
    setPeriod(value);
    getData(filter, null, null, value);
  }

  let filterProps = { onSearch: getData, size, setError };
  let graphProps = { tab, setTab, total, data: graphData, size, periodData, period, setPeriod: changePeriod };
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineViewColumn' };
  let listProps = { data, size };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Graph {...graphProps} />
        <div className='rp_list'>
          {data?.length ? <List {...listProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  )
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);