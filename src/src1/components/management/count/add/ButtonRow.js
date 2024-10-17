import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicBSIcon, Button, Confirm } from '../../../../../components/all';

export function ButtonRow(props){
  const { onClickCancel, onClickSave, onClickDelete, header } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const disabled = header?.status === 2 || header?.status === 3;
  const deletable = header?.status !== 0 && header?.status !== 1 && header?.status !== 2 //header?.picountNo;
  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  };
  const onDelete = () => setOpen(true);

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='invt_btn_row' id='co_btns'>
      {open && <Confirm {...confirmProps} />}
      {deletable && <DynamicBSIcon className="a_btn_delete" name="BsTrash" onClick={onDelete}/>}
      <Button className='invt_btn' text={t(disabled ? 'login.back' : 'page.cancel')} onClick={onClickCancel} />
      {!disabled && <Button className='invt_btn' id='invt_btn_save' text={t('page.save')} onClick={onClickSave} />}
    </div>
  );
}