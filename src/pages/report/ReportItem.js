import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { topColors } from '../../helpers';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/report/receipt';
import { Graph, Top } from '../../components/report/item';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodData, setPeriodData] = useState(t('report_review.periods'));
  const [date, setDate] = useState([]);
  const [filter, setFilter] = useState('');
  const [top, setTop] = useState([]);
  const [graph, setGraph] = useState([]);
  const [period, setPeriod] = useState('D');
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

  const getTop = data => {
    let top = [];
    data?.forEach(item => {
      let index = top.findIndex(t => t.invtID === item.invtID);
      if(index === -1) top.push(item);
      else {
        top[index].qty += item.qty;
        top[index].totalDiscAmt += item.totalDiscAmt;
        top[index].totalNetSalesAmt += item.totalNetSalesAmt;
        top[index].totalProfitAmt += item.totalProfitAmt;
        top[index].totalReturnAmt += item.totalReturnAmt;
        top[index].totalSalesAmt += item.totalSalesAmt;
      }
    });
    let topData = top?.sort((a, b) => b.totalNetSalesAmt - a.totalNetSalesAmt)?.slice(0, 5);
    setTop(topData);
    return topData;
  }

  const getLabel = (period1, item) => {
    let label = '';
    if(period1 === 'H') label = item.salesDate + ':00';
    else if(period1 === 'D') label = item.salesDate;
    else if(period1 === 'W') label = item.weekInterval;
    else if(period1 === 'M') label = item.salesDate + t('page.month');
    return label;
  }

  const getGraph = (data, topData, period1) => {
    let graphData = [];
    data?.forEach(item => {
      let tIndex = topData.findIndex(t => t.invtID === item.invtID);
      if(tIndex !== -1){
        topData[tIndex].color = topColors[tIndex];
        let label = getLabel(period1, item);
        let gIndex = graphData?.findIndex(g => g.label === label);
        let cItem = { name: item?.invtName, amt: item?.totalNetSalesAmt, color: topColors[tIndex] };
        let newItem = { label, row0:{amt:0}, row1:{amt:0}, row2:{amt:0}, row3:{amt:0}, row4:{amt:0} }
        if(gIndex === -1){
          graphData.push({...newItem, ['row' + tIndex]: cItem });
        } else {
          graphData[gIndex]['row' + tIndex] = cItem;
        }
      }
    });
    return graphData;
  }

  const formatData = (data, period, date) => {
    let newData = [];
    let diff = date[1]?.diff(date[0], 'days');
    if(period === 'D' && diff <= 60){
      for (let index = 0; index <= diff; index++) {
        let label = moment(date[0]).add(index, 'days')?.format('yyyy.MM.DD');
        let exists = data?.findIndex(res => label === res?.label);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ label, hide: true, row0:{amt:0}, row1:{amt:0}, row2:{amt:0}, row3:{amt:0}, row4:{amt:0} });
      }
    } else if(period === 'H'){
      for (let index = 0; index <= 23; index++) {
        let exists = data?.findIndex(res => index === res?.salesDate);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ salesDate: index > 10 ? index : ('0' + index),
          totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
      }
    } else if(period === 'W' && diff <= 366){
      let start = moment(date[0]).startOf('isoWeek');
      while(start.isBefore(date[1])){
        let weekInterval = start.format('yyyy.MM.DD') + ' - ' + moment(start).endOf('isoWeek').format('yyyy.MM.DD');
        let exists = data?.findIndex(res => weekInterval === res?.weekInterval);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ weekInterval, totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
        start.add(7, 'days');
      }
    } else newData = data?.sort((a, b) => a.label?.localeCompare(b.label));
    return newData;
  }

  const getData = async (query, q2, dates, period2) => {
    let period1 = dates ? setPeriods(dates) : period2;
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesByItem' + (query ?? '') + '&SearchPeriod=' + period1;
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      let top = getTop(response?.data);
      let graph = getGraph(response?.data, top, period1);
      setGraph(graph?.length ? formatData(graph, period1, dates ?? date) : []);
    }
    setFilter(query);
    setLoading(false);
  }

  const changePeriod = value => {
    setPeriod(value);
    getData(filter, null, null, value);
  }
  
  let filterProps = { onSearch: getData, size, setError };
  let card_id = size?.width >= 800 ? 'ri_large' : 'ri_small';
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineViewColumn' };
  let graphProps = {  bar: top, data: graph, size, period, setPeriod: changePeriod, periodData }

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        {top?.length ?
          <div className='ri_card' id={card_id}>
            <Top data={top} />
            <Graph {...graphProps} />
          </div>
          :
          <Empty1 {...emptyProps} />
        }
        {/* <div className='rp_list'> */}
          {/* {data?.length ? <List {...listProps} /> : <Empty1 {...emptyProps} />} */}
        {/* </div> */}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const ReportItem = withSizeHOC(Screen);