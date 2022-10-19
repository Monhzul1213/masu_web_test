import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../all';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave } = props;

  return (
    <div className='a_btn_row'>
      <Button className='a_btn' text={t('page.cancel')} onClick={onClickCancel} />
      <Button className='a_btn' id='a_btn_save' text={t('page.save')} onClick={onClickSave} />
    </div>
  )
}