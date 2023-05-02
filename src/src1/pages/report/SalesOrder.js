import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import '../../../css/invt.css';
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Filter, Card, List } from '../../components/report/order';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState('');
  const [filter1, setFilter1] = useState('');
  const [total, setTotal] = useState(null);
  const [excelName, setExcelName] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment(), moment()];
      let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query, null, dates);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1, dates) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesHold' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      let salesQty = 0, returnQty = 0, salesAmt = 0, returnAmt = 0, totalQty = 0, totalAmt = 0;
      response?.data?.cardview.forEach(item => {
        if(item?.status === 1){
          salesQty += (item?.qty ?? 0);
          salesAmt += (item?.amount ?? 0);
        } else if(item?.status === 0){
          totalQty += (item?.qty ?? 0);
          totalAmt += (item?.amount ?? 0);
        }
        else {
          returnQty += (item?.qty ?? 0);
          returnAmt += (item?.amount ?? 0);
        }
      });
      setTotal({totalQty, totalAmt, salesQty, returnQty, salesAmt, returnAmt});
      setData(response?.data);      
      setData1(response?.data?.item);
      setFilteredData(response?.data?.list?.filter(item => item?.status === tab));      
    }
    setLoading(false);
    setFilter(query);
    setFilter1(query1 ?? '');
    if(dates) setExcelName(t('header./report/report_document') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
  }

  const onChangeTab = value => {
    setTab(value);
    setFilteredData(data?.list?.filter(item => item?.status === value));
  } 

  let filterProps = { onSearch: getData, size, setError, filter, filter1 };
  let cardProps = { data: filteredData, data1, tab, setTab: onChangeTab, size, loading, excelName, getData, filter , total};
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Card {...cardProps} />
        <div className='rp_list'>
          {filteredData?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const SalesOrder = withSizeHOC(Screen);