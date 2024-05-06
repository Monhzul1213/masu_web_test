import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';
import '../../css/invt.css';
import '../../css/report.css';
import { Filter } from '../../components/report/review/Filter';
import { Charts } from '../../components/report/review/Charts'; 
import { List } from '../../components/report/review/List';
import { FiColumns } from "react-icons/fi";
import {getList} from '../../services'


function Screen(props){

  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('totalSalesAmt');
  const [total, setTotal] = useState(null);
  const [data, setData] = useState(null);
  const [date, setDate] = useState([]);
  const [periodData, setPeriodData] = useState(t('report_review.periods'));
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('D');

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

  const getData = async (query, query1) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesByTime' + (query ?? '') + (query1 ?? '');
  
    const response = await dispatch(getList(user, token, api));
    setData(response?.data);


    let sales = 0, refund = 0;
    response?.data?.map(item => {
      sales += item?.salesAmount ?? 0;
      refund += item?.returnAmount ?? 0;
    });
    setTotal({ sales, refund });
    setLoading(false);
  }
  
  
  const graphProps = {data, total, tab, setTab}
    return (
    <div className='s_container_r'>
      <Filter onSearch = {getData} />
      <Charts  {...graphProps}/>
      {data?.length ? <List data={data}/> :
        <div className={'empty_back1'}>
          <div className={'empty_icon_back'}>
              <FiColumns className='empty_icon'/>
          </div>
          <p className={'empty_descr'}>
          {t('page.no_filter')}
          </p>
        </div>
      }
    </div>
  );
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);
