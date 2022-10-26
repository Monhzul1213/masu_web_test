import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, IconButton } from './Button';
import { DynamicBSIcon } from './DynamicIcon';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, type } = props;

  return (
    <div className='a_btn_row'>
      <Button className='a_btn' text={t('page.cancel')} onClick={onClickCancel} />
      <Button className='a_btn' id='a_btn_save' text={t('page.save')} type={type} onClick={onClickSave} />
    </div>
  )
}

export function ButtonRowAdd(props){
  const { t } = useTranslation();
  const { type, onClickAdd, show, onClickDelete } = props;

  return (
    <div className='add_row_back'>
      <IconButton className='add_row_btn' text={t(type + '.add')} id='add_row_add'
        icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />} onClick={() => onClickAdd()} />
      {show && <IconButton className='add_row_btn' text={t('page.delete')} id='add_row_delete'
        icon={<DynamicBSIcon name='BsTrash' className='add_row_delete_icon' />} onClick={onClickDelete} />}
    </div>
  )
}