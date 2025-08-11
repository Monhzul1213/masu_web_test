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
import { Header } from '../../components/management/txn/Header';
import { DetailsTable } from '../../components/management/txn/DetailsTable';


export function InvtTxn(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [columns, setColumns] = useState([]);
  const [detailsColumns, setDetailsColumns] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
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
  
    let finalQuery = query ?? '';
    const isDtlValue = showDetails ? 'Y' : 'N';
  
    finalQuery = finalQuery.replace(/([?&])IsDtl=[^&]*/g, '');
    finalQuery = finalQuery.replace(/&&/g, '&').replace(/\?&/, '?').replace(/&$/, '');
  
    
    finalQuery += (finalQuery.includes('?') ? '&' : '?') + `IsDtl=${isDtlValue}`;
    if (query1) finalQuery += query1;
  
    const api = `Txn/GetTxnCostNew${finalQuery}`;
    const headers = { merchantid: user?.merchantId };
  
    const response = await dispatch(getList(user, token, api, null, headers));
    const rawData = Array.isArray(response?.data)
      ? response.data
      : (Array.isArray(response?.data?.data) ? response.data.data : []);
  
    if (response?.code === 1000) {
      setVisible(true);
      setSites(rawData);
    } else if (response?.error) {
      setError(response?.error);
      setData([]);
    } else {
      const transformedData = rawData.map((item, index) => ({
        ...item,
        signQty: divide(item.qty, item.sign, index),
      }));
      setData(transformedData);
      setExcelName(t('header./management/invt_txn'));
    }
  
    setLoading(false);
  };
  
  const onDone = async () => {
    setVisible(false);
    setSites([]);
    const query = `?BeginDate=${moment().format('YYYY.MM.DD')}&EndDate=${moment().format('YYYY.MM.DD')}`;
    onSearch(query);
  };

  const sharedProps = {
    data,
    setData,
    setError,
    onSearch,
    excelName,
    showDetails,
    setShowDetails,
    columns,
    setColumns,
    detailsColumns,
    setDetailsColumns
  };

  const subProps = { visible, setVisible, sites, setSites, onDone };
  const videoData = [{ id: "5mOM_Bc5Bl8" }];

  return (
    <div className='s_container_i' style={{maxWidth}}>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>
          {({ size }) => (
            <div className='i_list_cont_zz' id='invt_list_z1'>
              <Header
                {...sharedProps}
                currentColumns={showDetails ? detailsColumns : columns}
                size={size}
              />
              {showDetails ? (
                <DetailsTable {...sharedProps} size={size}
                setDetailsColumns={setDetailsColumns} />
              ) : (
                <List {...sharedProps} size={size} />
              )}
            </div>
          )}
        </SizeMe>
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  );
}