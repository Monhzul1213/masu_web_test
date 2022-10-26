import React, { useState } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

export function CheckAll(props){
  const { type, onCheckAll } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const onClick = () => {
    setChecked(!checked);
    onCheckAll && onCheckAll(!checked);
  }

  return (
    <div className='check_all'>
      {checked
        ? <ImCheckboxChecked className='check_all_btn' id='check_all_selected' onClick={onClick} />
        : <ImCheckboxUnchecked className='check_all_btn' onClick={onClick} />}
      <p className='check_all_lbl'>{t(type + '.check_lbl')}</p>
    </div>
  )
}