import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment'; 
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import '../../css/report.css';
import {getList} from '../../services'
import { Charts, List, Filter } from '../components/reportTime';
import { Empty1, Error1, Overlay } from '../../components/all';
import { useNavigate } from 'react-router-dom';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [ error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
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
      let api = 'Sales/GetSalesByTime' + (query ?? '') + (query1 ?? '');
      const response = await dispatch(getList(user, token, api));
      if(response?.error) setError(response?.error);
      else {
        setData(response?.data?.sort((a,b )=> a.salesTime - b.salesTime));
        let sales = 0, refund = 0;
         response?.data?.forEach(item=> {
          sales+= item?.salesAmount ?? 0;
          refund+= item?.returnAmount ?? 0;
         })
        setTotal({sales, refund})
      }
      if(dates) setExcelName(t('header./report/report_employee') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
      setLoading(false);
    };

  const graphProps = {data, total}
  const emptyProps = {id: 'rp_empty', icon: 'MdOutlineReceiptLong' }
  const filterProps = {onSearch: getData, size }
  const listProps = { data, excelName }

    return (
      <div className='s_container_r'>
        <Overlay loading={loading}>
          {error && <Error1 error={error} />}
            <Filter {...filterProps}/>
            {data?.length ? 
              <div>
                <Charts  {...graphProps}/>
                <List {...listProps}/> 
              </div>
            : <Empty1 {...emptyProps}/>}
        </Overlay>
      </div>
  );
}

const withSizeHOC = withSize();
export const ReportTime = withSizeHOC(Screen);
