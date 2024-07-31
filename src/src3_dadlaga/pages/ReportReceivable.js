import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment'; 
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import '../../css/report.css';
import { getList } from '../../services'
import { List, Filter } from '../components/reportReceivable';
import { Empty1, Error1, Overlay } from '../../components/all';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const dispatch = useDispatch();
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
      let api = 'Txn/GetArReport' + (query ?? '') + (query1 ?? '');
      let headers = { merchantid: user?.merchantId };
      const response = await dispatch(getList(user, token, api, null, headers));
      if (response?.error) setError(response?.error);
      else {
        setData(response?.data?.msCustomer);
      }
      if(dates) setExcelName(t('header./report/report_receivable') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
      setLoading(false);
    };

  const emptyProps = {id: 'rp_empty', icon: 'MdOutlineReceiptLong' }
  const filterProps = {onSearch: getData, size }
  const listProps = { data, excelName }

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
export const ReportReceivable = withSizeHOC(Screen);
