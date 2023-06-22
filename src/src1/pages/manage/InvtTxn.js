import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SizeMe } from 'react-sizeme';
import moment from 'moment';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import '../../css/management.css'
import { List } from '../../components/management/txn';
import { divide } from '../../../helpers';


export function InvtTxn(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment(), moment()];
      let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query, null, dates);   
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1 ) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetTxnCost' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      response?.data.forEach((item, a) => {
        item.qty_sign = divide(item.qty, item.sign, a)
      })
      setData(response?.data);
      setExcelName(t('header./management/invt_txn'));
    }
    setLoading(false);  
  }

  const listProps = { data, excelName, setError, onSearch: getData };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
              <div className='i_list_cont_zz' id='invt_list_z1'>
                <List {...listProps} size={size} /> 
              </div>
          }</SizeMe>
      </Overlay>
    </div>
  );
}
