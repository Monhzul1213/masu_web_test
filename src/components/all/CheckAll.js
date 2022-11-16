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

export function CheckBtn(props){
  const { checked, onClick, disabled } = props;

  return (
    <button className='check_btn' onClick={onClick} disabled={disabled}>
      {checked
        ? <ImCheckboxChecked className='check_btn_icon' id='check_all_selected' />
        : <ImCheckboxUnchecked className='check_btn_icon' />}
    </button>
  );
}

export function CheckAll(props){
  const { type, checked, onCheckAll, style } = props;
  const { t } = useTranslation();

  const onClick = () => {
    onCheckAll && onCheckAll(!checked);
  }

  return (
    <div className='check_all' style={style}>
      <Check checked={checked} onClick={onClick} />
      <p className='check_all_lbl'>{t(type + '.check_lbl')}</p>
    </div>
  )
}

export function CheckBox(props){
  const { label, checked, setChecked } = props;
  const { t } = useTranslation();

  const onClick = () => {
    setChecked(!checked);
  }

  return (
    <div className='i_check_row'>
      <Check checked={checked} onClick={onClick} />
      <p className='i_check_lbl'>{t(label)}</p>
    </div>
  );
}