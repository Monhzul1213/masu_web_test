import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, IconButton } from './Button';
import { DynamicBSIcon } from './DynamicIcon';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2 } = props;

  return (
    <div className='a_btn_row'>
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onClickDelete} />}
      <Button className='a_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='a_btn' id='a_btn_save' text={t(text2 ?? 'page.save')} type={type} onClick={onClickSave} />
    </div>
  )
}

export function ButtonRow1(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2, id } = props;

  return (
    <div className='invt_btn_row_z' id={id}>
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onClickDelete} />}
      <Button className='invt_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='invt_btn' id='invt_btn_save' text={t(text2 ?? 'page.save')} type={type} onClick={onClickSave} />
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