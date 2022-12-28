import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import moment from 'moment';
import '../../css/report.css'
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../components/all/all_m';
import {Filter,  List, Header, Card  } from '../../components/report/tax'
function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [filter, setFilter] = useState('');
  const [filter1, setFilter1] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1) => {
    setError(null);
    setLoading(true);
    let api = 'Sales/GetSalesVat' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {      
      setData(response?.data.salesdtl);
      let sales = [], vat = [], nhat = []
      response?.data.salestotal?.forEach(element => {
        sales = element.totalSalesAmount
        vat = element.totalVatAmount
        nhat = element.totalNHATAmount 
      });
      setTotal({sales, vat, nhat});
    }
    setLoading(false);
    setFilter(query);
    setFilter1(query1 ?? ''); 
  }



  let filterProps = { onSearch: getData, size, setError, filter, filter1 };
  let listProps = { data, size,  loading };
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineViewColumn' };
  let cardProps = { total, size,  loading };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Card {...cardProps}/>
        <div className='rp_list'>
        <Header {...filterProps} />
          {data?.length ? <List {...listProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Taxes = withSizeHOC(Screen);