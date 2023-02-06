import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import '../../css/invt.css';
import FormatSheet from '../../assets/Baraa_Format.xlsx';
import { ButtonRowConfirm, Error1, Overlay, UploadDrag } from '../../components/all';

export function InventoryImport(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const user = useSelector(state => state.login.user);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickCancel = () => navigate('/inventory/invt_list');

  const onClickSave = async () => {
    setError(null);
    setLoading(true);
    console.log(file);
    setLoading(false);
  }

  const uploadProps = { file, setFile };
  const btnProps = { onClickCancel, onClickSave, show: false, id: 'mo_ac_btns' };

  return (
    <Overlay className='i_container' loading={loading}>
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <div className='ma_back'>
          <div className='ii_header'>
            <p className='ii_title'>{t('inventory.import_title')}</p>
            <a className='ii_link' href={FormatSheet} download='Baraa_Format.xlsx'>{t('inventory.import_link')}</a>
          </div>
          <UploadDrag {...uploadProps} />
        </div>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}