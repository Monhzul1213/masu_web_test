import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import '../../css/invt.css';
import '../../css/report.css';
import { getList } from '../../services';
import { Filter, List } from '../components/reportBuyer';
import { Empty1, Error1, Overlay } from '../../components/all';
import { useNavigate } from 'react-router-dom';

function Screen(props) {
  const { size } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [excelName, setExcelName] = useState('');
  const { user, token } = useSelector(state => state.login);
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
    let api = 'Sales/GetSalesByConsumer' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if (response?.error) setError(response?.error);
    else {
      setData(response?.data?.sales);
    }
    setFilter(query1);
    setLoading(false);
    if(dates) setExcelName(t('header./report/report_buyer') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
  };

  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };
  let filterProps = { setError, onSearch: getData, size, filter };
  let listProps = { data, excelName, size, loading };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps}/>
        {data?.length ? <List {...listProps}/> : <Empty1 {...emptyProps}/>}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const ReportBuyer = withSizeHOC(Screen);
