// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { withSize } from 'react-sizeme';
// import { useTranslation } from 'react-i18next';
// import moment from 'moment';
// import '../../css/report.css'
// import { getList } from '../../../services';
// import { Empty1, Error1, Overlay } from '../../components/all/all_m';
// import {Filter, List, Graph } from '../../components/report/inventory'
// function Screen(props){
//   const { size } = props;
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
//   const [filter, setFilter] = useState('');
//   // const [filter1, setFilter1] = useState('');
//   const [date, setDate] = useState([]);
//   // const [total, setTotal] = useState(null);
//   const [graphData, setGraphData] = useState(null);
//   const [period, setPeriod] = useState('D');
//   const [periodData, setPeriodData] = useState(t('report_review.periods'));
//   const { user, token }  = useSelector(state => state.login);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
//     else {
//       let dates = [moment()?.startOf('month'), moment()];
//       let query = '?BeginDate=' + dates[0]?.format('yyyy.MM.DD') + '&EndDate=' + dates[1]?.format('yyyy.MM.DD');
//       getData(query, null, dates);
//     }
//     return () => {};
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const setPeriods = dates => {
//     let diff = dates[1]?.diff(dates[0], 'days');
//     let newPeriod = period;
//     if(diff === 0){
//       setPeriodData(old => old?.map(item => { return {...item, disabled: item.value !== 'H'} }));
//       newPeriod = 'H';
//     } else {
//       if(period === 'H') newPeriod = 'D';
//       if(dates[1].isSame(dates[0], 'month')){
//         if(period === 'M') newPeriod = 'D'
//         setPeriodData(old => old?.map(item => { return {...item, disabled: item.value === 'H' || item.value === 'M' } }));
//       } else {
//         setPeriodData(old => old?.map(item => { return {...item, disabled: item.value === 'H'} }));
//       }
//     }
//     setPeriod(newPeriod);
//     setDate(dates);
//     return newPeriod;
//   }
  
//   const formatData = (data, period, date) => {
//     let newData = [];
//     let diff = date[1]?.diff(date[0], 'days');
//     if(period === 'D' && diff <= 60){
//       for (let index = 0; index <= diff; index++) {
//         let salesDate = moment(date[0]).add(index, 'days')?.format('yyyy-MM-DDT00:00:00');
//         let exists = data?.findIndex(res => salesDate === res?.salesDate);
//         if(exists !== -1) newData.push(data[exists]);
//         else newData.push({ salesDate });    
//         console.log(newData)

//       }
//     } else if(period === 'H'){
//       for (let index = 0; index <= 23; index++) {
//         let exists = data?.findIndex(res => index === res?.salesDate);
//         if(exists !== -1) newData.push(data[exists]);
//         else newData.push({ salesDate: index > 10 ? index : ('0' + index), });
//       }
//     } else if(period === 'W' && diff <= 366){
//       let start = moment(date[0]).startOf('isoWeek');
//       while(start.isBefore(date[1])){
//         let weekInterval = start.format('yyyy.MM.DD') + ' - ' + moment(start).endOf('isoWeek').format('yyyy.MM.DD');
//         let exists = data?.findIndex(res => weekInterval === res?.weekInterval);
//         if(exists !== -1) newData.push(data[exists]);
//         else newData.push({ weekInterval,  });
//         start.add(7, 'days');
//       }
//     } else newData = data;
//     return newData;
//   }
//   const changePeriod = value => {
//     setPeriod(value);
//     getData(filter, null, null, value);
//   }

//   const getData = async (query, q2, dates, period2) => {
//     let period1 = dates ? setPeriods(dates) : period2;
//     setError(null);
//     setLoading(true);
//     let api = 'Sales/GetSalesByItem' + (query ?? '') + '&SearchPeriod=' + period1;
//     const response = await dispatch(getList(user, token, api));
//     console.log(response)
//     if(response?.error) setError(response?.error);
//     else {
//       let graphData = response?.data ? response?.data
//       // .sort((a, b) => b.totalNetSalesAmt - a.totalNetSalesAmt).slice(0, 5)
//       : []
//       console.log(graphData)
//       let list = [];
//       graphData?.forEach(item => 
//         {
//         if(period1 === 'H') item.label = item.salesDate + ':00';
//         else if(period1 === 'D') item.label = moment(item.salesDate)?.format('yyyy.MM.DD');
//         else if(period1 === 'W') item.label = item.weekInterval;
//         else if(period1 === 'M') item.label = item.salesDate + t('page.month');
//         let index = list.findIndex(l => l.salesDate === item?.salesDate);
//         if(index === -1){
//           list.push({ salesDate: item.salesDate, [item.invtName]: item.totalNetSalesAmt });
//         } else {
//           list[index][item.invtName] = item.totalNetSalesAmt;
//         }
//       })
//       console.log(list);
//       setLoading(false);
//       setData(response?.data)
//       setGraphData(list);
//       return;
//       graphData?.forEach(item => {
//         if(period1 === 'H') item.label = item.salesDate + ':00';
//         else if(period1 === 'D') item.label = moment(item.salesDate)?.format('yyyy.MM.DD');
//         else if(period1 === 'W') item.label = item.weekInterval;
//         else if(period1 === 'M') item.label = item.salesDate + t('page.month');
//       });
//       setData(response?.data ?? []);
//       setGraphData(graphData?.length ? formatData(graphData, period1, dates ?? date) : []);
//     }
//     setLoading(false);
//     setFilter(query);
//   }

 

//   let filterProps = { onSearch: getData, size, setError, filter,  };
//   let cardProps = { data, size, loading };
//   let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };
//   let chartProps = {   data: graphData, size, periodData, period, setPeriod: changePeriod };

//   return (
//     <div className='s_container_r'>
//       <Overlay loading={loading}>
//         {error && <Error1 error={error} />}
//         <Filter {...filterProps} />
//         <Graph {...chartProps} />
//         <div className='rp_list_z'>
//           {/* <Header {...filterProps} /> */}
//           {data?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
//         </div>
//       </Overlay>
//     </div>
//   );
// }

// const withSizeHOC = withSize();
// export const SalesItem = withSizeHOC(Screen);