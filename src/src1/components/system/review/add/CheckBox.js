import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check  } from '../../../all/all_m';

export function CheckBox(props){
  const { label, checked, style, disabled, className, onChange } = props;
  const { t } = useTranslation();

  const onClick = () => {
    onChange(!checked)
  }

  return (
    <div className= {className ?? 'r_check_row'} style={style} >
      <Check checked={checked} onClick={onClick} disabled={disabled} />
      <p className='i_check_lbl'>{t(label)}</p>
    </div>
  );
}