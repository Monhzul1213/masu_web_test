import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import '../../css/invt.css';
import '../../css/report.css';
import { Filter } from '../../components/report/review/Filter';
import Charts from '../../components/report/review/Charts'; 
import { List } from '../../components/report/review/List';
import { FiColumns } from "react-icons/fi";
import {getList} from '../../services'
import moment from 'moment'; 
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Screen(props){

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const [ error, setError] = useState(null);
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [tab, setTab] = useState('salesAmount');

  useEffect(() => {
    let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' +moment()?.format('yyyy.MM.DD');
    getData(query);
  }, []);
    
  const getData = async (query, query1, dates) => {
    setError(null);
    setLoading(true);
      let api = 'Sales/GetSalesByTime' + (query ?? '') + (query1 ?? '');
      const response = await dispatch(getList(user, token, api));
         setData(response?.data);
         let sales = 0, refund = 0, avgSales = 0;
         response?.data?.map(item=> {
          sales+= item?.salesAmount ?? 0;
          refund+= item?.returnAmount ?? 0;
         })
    setTotal({sales, refund})
    setLoading(false);
  };

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