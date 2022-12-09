import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../all';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, onClickDraft, text1, text2, text3, id } = props;

  return (
    <div className='invt_btn_row' id={id}>
      <Button className='invt_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='invt_btn' text={t(text2 ?? 'page.draft')} onClick={onClickDraft} />
      <Button className='invt_btn' id='invt_btn_save' text={t(text3 ?? 'page.save')} onClick={onClickSave} />
    </div>
  );
}