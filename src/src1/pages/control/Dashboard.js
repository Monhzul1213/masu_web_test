import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { Overlay} from '../../../components/all';
import { getList } from '../../../services';
import { Graph, Card, CardHeader } from '../../components/control/dashboard';


function Screen(props){
  const {size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [arData, setArData] = useState([]);
  const [remainData, setRemainData] = useState([]);

  const [graphData, setGraphData] = useState(null);
  const [tab, setTab] = useState('totalSalesAmt');
  const [total, setTotal] = useState(null);
  const [total1, setTotal1] = useState(null);
  const [total2, setTotal2] = useState(null);
  const [total3, setTotal3] = useState(null);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment(), moment()];
      let query = '?BeginDate=' + dates[0]?.format('yyyy.MM.DD') + '&EndDate=' + dates[1]?.format('yyyy.MM.DD');
      getData(query, null, dates);
      getData1(query);
      getData2(query);
      getData3()
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if(size?.width >= 870) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 49px - 22px)');
    else if(size?.width < 870 && size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 113px - 22px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 162px - 22px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const formatData = (data, period) => {
    let newData = [];
    if(period === 'H'){
      for (let index = 0; index <= 23; index++) {
        let exists = data?.findIndex(res => index === res?.salesDate);
        if(exists !== -1) newData.push(data[exists]);
        else newData.push({ salesDate: index >= 10 ? index : ('0' + index),
          totalSalesAmt: 0, totalReturnAmt: 0, totalDiscAmt: 0, totalNetSalesAmt: 0, totalProfitAmt: 0 });
      }
    }
    else newData = data;
    return newData;
  }

  const getData3 = async () => {
    setLoading(true);
    let api = 'Txn/GetHandQtyDtl' ;
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      let qty = 0, cost = 0;
      response?.data?.dtl.forEach(item => {
          qty += (item?.qty ?? 0);
          cost += item?.totalCost ?? 0
      });
      setTotal3({qty, cost});  
      setRemainData(response?.data?.dtl); 
    }
    setLoading(false);
  };

  const getData = async (query, q2, dates) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesSummary' + (query ?? '') + '&SearchPeriod=' + 'H';
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      setCardData(response?.data && response?.data[2]?.sort((a, b) => b.salesPercent - a.salesPercent));
      let sales = 0, refund = 0, discount = 0, net = 0, profit = 0, salesQty = 0;
      let graphData = response?.data && response?.data[0];
      graphData?.forEach(item => {
        sales += item?.totalSalesAmt ?? 0;
        refund += item?.totalReturnAmt ?? 0;
        discount += item?.totalDiscAmt ?? 0;
        net += item?.totalSalesAmt- item?.totalReturnAmt - item?.totalDiscAmt?? 0;
        profit += item?.totalProfitAmt ?? 0;
        salesQty += item?.salesQty ?? 0;
        item.label = item.salesDate + ':00';
      });
      setTotal({ sales, refund, discount, net, profit, salesQty });
      setGraphData(graphData?.length ? formatData(graphData, 'H', dates) : []);
      setSalesData(response?.data && response?.data[1])
    }
    setLoading(false);
  }

  const getData1 = async (query) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesHold' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      let totalQty = 0, totalAmt = 0;
      response?.data?.cardview.forEach(item => {
        if(item?.status === 0){
          totalQty += (item?.qty ?? 0);
          totalAmt += (item?.amount ?? 0);
        }
      });
      setTotal1({totalQty, totalAmt});   
      response?.data?.list?.forEach(item => {
        let acc = item.ticketDescr ? item.ticketDescr?.split('|') : []
        let a = acc[0] ? acc[0] + '\n': ''; let b = acc[1] ? acc[1]  + '\n': ''; let c = acc[2] ? acc[2]+ '\n': '' ; let d = acc[3] ? acc[3]: '';
        item.ticket = a + b + c + d
      })
      setOrderData(response?.data?.list?.filter(item => item?.status === 0));    
    }
    setLoading(false);
  }

  const getData2 = async (query) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetArReport' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      let totalBeginAmt = 0, amt = 0;
      response?.data?.msCustomer?.forEach(item=> {
        totalBeginAmt += item?.beginArAmount
        amt +=item?.endArAmount
      })
      setTotal2({totalBeginAmt, amt});   
      setArData(response?.data?.msCustomer);    
    }
    setLoading(false);
  }



  const cardProps = {data: cardData, size}
  const cardHeaderProps = {size, salesData, total, orderData, total1, arData, total2, remainData, total3}
  const graphProps = { tab, setTab, total, data: graphData, size };

  return (
    <div className='store_tab' style={{maxHeight, margin: '15px 10px'}}>
      <Overlay loading={loading}>
        <CardHeader {...cardHeaderProps}/>
        <Card {...cardProps}/>
        <Graph {...graphProps} />
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Dashboard = withSizeHOC(Screen);