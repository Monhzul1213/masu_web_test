import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Confirm } from '../../../all/all_m';

export function ButtonRow(props){
  const { onClickCancel, onClickSave, onClickDelete, header } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const disabled = header?.status === 2 || header?.status === 3;
  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  };

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='invt_btn_row' id='co_btns'>
      {open && <Confirm {...confirmProps} />}
      <Button className='invt_btn' text={t(disabled ? 'login.back' : 'page.cancel')} onClick={onClickCancel} />
      {!disabled && <Button className='invt_btn' id='invt_btn_save' text={t('page.save')} onClick={onClickSave} />}
    </div>
  );
}