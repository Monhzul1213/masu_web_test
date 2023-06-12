import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Confirm, DynamicBSIcon } from '../../../all';

export function ButtonRow(props){
  const { onClickCancel, onClickSave, onClickDraft, text1, text2, text3, id, hide, deletable, onClickDelete } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='invt_btn_row' id={id}>
      {open && <Confirm {...confirmProps} />}
      {deletable && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onDelete} />}
      <Button className='invt_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      {!hide && <Button className='invt_btn' text={t(text2 ?? 'page.draft')} onClick={onClickDraft} />}
      <Button className='invt_btn' id='invt_btn_save' text={t(text3 ?? 'page.save')} onClick={onClickSave} />
    </div>
  );
}