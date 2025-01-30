import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SizeMe } from 'react-sizeme';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import '../../css/time.css'
import { Drawer, List } from '../../components/management/remain';
import { Subscription } from '../../../components/management/adjust/list';
import { List1 } from '../../components/management/remain/List1';


export function Remain(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dtlData, setDtlData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [autoResetExpanded, setAutoResetExpanded] = useState(false);
  const [isDtl, setIsDtl] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else { onSearch() }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (query, query1, isEdit ) => {
    setError(null);
    setLoading(true);
    setAutoResetExpanded(isEdit ? false : true);
    let api = 'Txn/GetHandQtyDtl' + (query ?? '' ) + (query1 ?? '');
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
      response?.data?.hdr?.forEach(item => {
        let detail = [];
        response?.data?.dtl?.forEach(list => {
          if(item?.invtID === list?.sourceInvtID) {
            detail.push(list)
          }
        })
        item.dtl = detail;
      })
      setData(response?.data?.hdr ?? response?.data?.dtl ?? []);
      setDtlData(response?.data?.dtl ?? []);
      setExcelName(t('header./management/invt_remainder'));
    }
    setLoading(false);  
  }

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    onSearch();
  }

  const onRowClick = row => {
    setSelected(row?.original);
    setOpen(true);
  }

  const listProps = { data, excelName, setError, onSearch, setData, autoResetExpanded, dtlData, isDtl, setIsDtl, onRowClick, isDate, setIsDate };
  const subProps = { visible, setVisible, sites, setSites, onDone };
  const drawerProps = { selected, open, setOpen };

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
      <Drawer {...drawerProps} />
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont_zz' id='invt_list_z'>
            {!isDtl ? <List {...listProps} size={size} /> : <List1 {...listProps} size={size}/>}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}
