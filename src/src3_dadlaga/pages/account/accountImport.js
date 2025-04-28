import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import '../../../css/invt.css';
import { getList, sendRequest } from '../../../services';
import { ButtonRowConfirm, Error1, Overlay } from '../../../components/all';
import { Format } from '../../components/accounts/Format';

export function AccountImport() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formatData, setFormatData] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    
    // Fetch the account format columns and data on component mount
    fetchAccountFormat();
    
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccountFormat = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getList(user, token, 'Txn/GetAccountFormat'));
      if (response?.error) {
        setError(response?.error);
      } 
      else { setFormatData(response?.data || response?.data || []); }
    } catch (err) {
      setError(t('account.format_fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  const onClickCancel = () => navigate('/finance/account');

  const onClickSave = async () => {
    setError(null);
    if (file) {
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file?.object);
      let response = await dispatch(
        sendRequest(user, token, 'Txn/AddAccountExcel', formData, 'multipart/form-data')
      );
      
      if (response?.error) setError(response?.error);
      else {
        message.success(t('account.add_success'));
        setFile(null);
      }
      setLoading(false);
    } else {
      setError(t('account.import_error'));
    }
  };


  const btnProps = {
    onClickCancel,
    onClickSave,
    show: false,
    id: 'mo_ac_btns'
  };
  
  const formatProps = { data: formatData, file, setFile}

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