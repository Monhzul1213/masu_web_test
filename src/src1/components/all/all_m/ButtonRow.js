import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

import { Confirm } from './Confirm';
import { Button, IconButton } from './Button';
import { DynamicBSIcon } from './DynamicIcon';
import { CheckBox } from './CheckAll';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2, check, label, checked, setChecked } = props;

  return (
    <div className='a_btn_row'>
      {check && <CheckBox className='tm_btn_check' id='tm_check' checked={checked}  setChecked={setChecked} label={label} />}
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
export function ButtonRow2(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickDelete,  show, text1,  } = props;

  return (
    <div className='a_btn_row'>
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onClickDelete} />}
      <Button className='a_btn' text={t(text1 ?? 'supplier.close')} onClick={onClickCancel} />
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

export function ButtonUpdate(props){
  const { t } = useTranslation();
  const { type, onClickAdd} = props;

  return (
    <Button className='order_row_btn' text={t(type + '.update')} id='add_row_add' onClick={() => onClickAdd()} />
  )
}

export function ButtonRowConfirm(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2, id } = props;
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='invt_btn_row_z' id={id}>
      {open && <Confirm {...confirmProps} />}
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onDelete} />}
      <Button className='invt_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='invt_btn' id='invt_btn_save' text={t(text2 ?? 'page.save')} type={type} onClick={onClickSave} />
    </div>
  )
}
export function ButtonRowAddConfirm(props){
  const { t } = useTranslation();
  const { type, onClickAdd, show, onClickDelete } = props;
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='add_row_back'>
      {open && <Confirm {...confirmProps} />}
      <IconButton className='add_row_btn' text={t(type + '.add')} id='add_row_add'
        icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />} onClick={() => onClickAdd()} />
      {show && <IconButton className='add_row_btn' text={t('page.delete')} id='add_row_delete'
        icon={<DynamicBSIcon name='BsTrash' className='add_row_delete_icon' />} onClick={onDelete} />}
    </div>
  )
}