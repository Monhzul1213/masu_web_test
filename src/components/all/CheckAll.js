import React from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

export function Check(props){
  const { checked, onClick } = props;

  return (
    checked
      ? <ImCheckboxChecked className='check_all_btn' id='check_all_selected' onClick={onClick} />
      : <ImCheckboxUnchecked className='check_all_btn' onClick={onClick} />
  );
}

export function CheckAll(props){
  const { type, checked, onCheckAll } = props;
  const { t } = useTranslation();

  const onClick = () => {
    onCheckAll && onCheckAll(!checked);
  }

  return (
    <div className='check_all'>
      <Check checked={checked} onClick={onClick} />
      <p className='check_all_lbl'>{t(type + '.check_lbl')}</p>
    </div>
  )
}