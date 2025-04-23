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
import { Subscription } from '../../../components/management/adjust/list';
import { Help } from '../../../components/invt/inventory/list';


export function InvtTxn(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewItemBalance !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment(), moment()];
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      onSearch(query, null, dates);   
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (query, query1 ) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetTxnCost' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
      setSites(response?.data);
    }
    else if(response?.error) setError(response?.error);
    else {
      response?.data.forEach((item, a) => {
        item.signQty = divide(item.qty, item.sign, a)
      })
      setData(response?.data);
      setExcelName(t('header./management/invt_txn'));
    }
    setLoading(false);  
  }

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
    onSearch(query);
  }

  const listProps = { data, excelName, setError, onSearch, setData };
  const subProps = { visible, setVisible, sites, setSites, onDone };
  const videoData = [{id: "5mOM_Bc5Bl8"}]

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
              <div className='i_list_cont_zz' id='invt_list_z1'>
                <List {...listProps} size={size} /> 
              </div>
          }</SizeMe>
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  );
}
