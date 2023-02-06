import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { ButtonRowConfirm, Error1, Overlay, UploadDrag } from '../../components/all';

export function InventoryImport(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
            <a className='ii_link'>{t('inventory.import_link')}</a>
          </div>
          <UploadDrag {...uploadProps} />
        </div>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}