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
  const { label, checked, setChecked, style, disabled } = props;
  const { t } = useTranslation();

  const onClick = () => {
    setChecked(!checked);
  }

  return (
    <div className='i_check_row' style={style} id ='is_check'>
      <Check checked={checked} onClick={onClick} disabled={disabled} />
      <p className='i_check_lbl'>{t(label)}</p>
    </div>
  );
}

export function CheckBox1(props){
  const { label, checked, setChecked, style, disabled, onHide } = props;
  const { t } = useTranslation();

  const onClick = () => {
    setChecked(!checked);
    if(!checked) onHide()
  }

  return (
    <div className='i_check_row' style={style} id ='is_check1'>
      <Check checked={checked} onClick={onClick} disabled={disabled} />
      <p className='i_check_lbl'>{t(label)}</p>
    </div>
  );
}