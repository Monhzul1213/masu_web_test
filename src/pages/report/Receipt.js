import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter, Card, List } from '../../components/report/receipt';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [tab, setTab] = useState(-1);
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
      let dates = [moment()?.startOf('month'), moment()];
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query, null, dates);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1, dates) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSales' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      let salesQty = 0, returnQty = 0, salesAmt = 0, returnAmt = 0;
      response?.data?.salesResp.forEach(item => {
        if(item?.sale?.salesType === 0){
          salesQty += 1;
          salesAmt += (item?.sale?.totalSalesAmount ?? 0);
        } else {
          returnQty += 1;
          returnAmt += (item?.sale?.totalSalesAmount ?? 0);
        }
      });
      setTotal({
        totalQty: response?.data?.salesResp?.length,
        totalAmt: salesAmt + returnAmt,
        salesQty, returnQty, salesAmt, returnAmt
      });
      setData(response?.data?.salesResp);
      tab === -1
        ? setFilteredData(response?.data?.salesResp)
        : setFilteredData(response?.data?.salesResp?.filter(item => item?.sale?.salesType === tab));
    }
    setLoading(false);
    setFilter(query);
    setFilter1(query1 ?? '');
    if(dates) setExcelName(t('header./report/report_document') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
  }

  const onChangeTab = value => {
    setTab(value);
    value === -1
      ? setFilteredData(data)
      : setFilteredData(data?.filter(item => item?.sale?.salesType === value));
  }

  let filterProps = { onSearch: getData, size, setError, filter, filter1 };
  let cardProps = { data: filteredData, tab, setTab: onChangeTab, size, total, loading, excelName, getData, filter };
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
export const Receipt = withSizeHOC(Screen);