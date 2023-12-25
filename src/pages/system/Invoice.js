import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Header, List } from '../../components/system/invoice/list';

export function Invoice(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filter,  setFilter] =   useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.isAdmin){
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') +
        '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    } else 
      navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetInvoice' + (query ?? '');
    console.log(api)
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        if(item?.status === 1) item.row_color = '#effd5f';
        else if(item?.status === 2) item.row_color = '#6ad6f7';
        else if(item?.status === 3) item.row_color = '#69db91';
        else if(item?.status === 9) item.row_color = '#c0c0c2';
        else item.row_color = '#ffffff';
        item.label1 = (item.descr ?? '') + '-' + (item.empName ?? '') + '-' + (item.phone ?? '');
      });
      setData(response?.data);
    }
    setLoading(false);
    setFilter(query ?? '');
  }

  const onClickAdd = row => {
    if(row?.status < 3)
      navigate({ pathname: 'invoice_add', search: createSearchParams({ invoiceNo: row?.invoiceNo }).toString() });
  }

  const headerProps = { setError, onSearch: getData, filter, data };
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };
  const listProps = { data, setData, onClickAdd, getData};

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='solve_list'>
            <Header {...headerProps} size={size} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}