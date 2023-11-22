import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import '../../../css/invt.css';
import { sendRequest, getList } from '../../../services';
import { ButtonRowConfirm, Error1, Overlay } from '../../../components/all';
import { Format } from '../../components/management/remain/Format';

export function RemainImport(){
  const { t } = useTranslation();
  const [date, setDate] = useState(moment());
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onFormat()
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormat = async ( query ) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetSiteInventory' + (query !== undefined ? query : '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else { setData(response?.data) }
    setLoading(false);    
  }

  const onClickCancel = () => navigate('/management/invt_remainder');

  const onClickSave = async () => {
    let query = '?TxnDate=' + date?.format('yyyy.MM.DD');
    setError(null);
    if(file){
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file?.object);
      let api = 'Txn/ModSiteInventory' + query ?? ''
      let response =
        await dispatch(sendRequest(user, token, api, formData, 'multipart/form-data'));
      if(response?.error) setError(response?.error);
      else {
        message.success(t('remain.add_success'));
        setFile(null);
      }
      setLoading(false);
    } else
      setError(t('inventory.import_error'));
  }

  const btnProps = { onClickCancel, onClickSave, show: false, id: 'mo_ac_btns' };
  const formatProps = { data, file, setFile, site, setSite, sites, setSites, onFormat, date, setDate }

  return (
    <Overlay className='i_container' loading={loading}>
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Format {...formatProps}/>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}