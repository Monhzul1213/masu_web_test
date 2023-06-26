import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SizeMe } from 'react-sizeme';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import '../../css/time.css'
import { List } from '../../components/management/remain';
import { Subscription } from '../../../components/management/adjust/list';


export function Remain(){
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
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else { onSearch() }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (query, query1 ) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetHandQty' + (query ?? '' ) + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
      setSites(response?.data);
    }
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data);
      setExcelName(t('header./management/invt_remainder'));
    }
    setLoading(false);  
  }

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    onSearch();
  }

  const listProps = { data, excelName, setError, onSearch };
  const subProps = { visible, setVisible, sites, setSites, onDone };

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
              <div className='i_list_cont_zz' id='invt_list_z'>
                <List {...listProps} size={size} /> 
              </div>
          }</SizeMe>
      </Overlay>
    </div>
  );
}
