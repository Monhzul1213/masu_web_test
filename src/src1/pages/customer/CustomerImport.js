import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../../css/invt.css';
import FormatSheet from '../../assets/Customer_Format.xlsx';
import { excelTypes } from '../../../helpers';
import { sendRequest } from '../../../services';
import { ButtonRowConfirm, Error1, Overlay, UploadDrag } from '../../../components/all';

export function CustomerImport(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickCancel = () => navigate('/customer');

  const onClickSave = async () => {
    setError(null);
    if(file){
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file?.object);
      let response =
        await dispatch(sendRequest(user, token, 'Site/Customer/AddExcel', formData, 'multipart/form-data'));
      if(response?.error) setError(response?.error);
      else {
        message.success(t('inventory.add_success'));
        setFile(null);
      }
      setLoading(false);
    } else
      setError(t('inventory.import_error'));
  }

  const uploadProps = { file, setFile, types: excelTypes };
  const btnProps = { onClickCancel, onClickSave, show: false, id: 'mo_ac_btns' };

  return (
    <Overlay className='i_container' loading={loading}>
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <div className='ma_back'>
          <div className='ii_header'>
            <p className='ii_title'>{t('customer.import_title')}</p>
            <a className='ii_link' href={FormatSheet} download='Customer_Format.xlsx'>{t('customer.import_link')}</a>
          </div>
          <UploadDrag {...uploadProps} />
        </div>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}