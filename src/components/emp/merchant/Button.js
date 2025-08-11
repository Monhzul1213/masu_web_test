import React from 'react';
import { Loader } from '../../all/Loader';
import { useTranslation } from 'react-i18next';

import { Button } from '../../all';


export function IconButton(props){
  const { loading, type, className, id, text, icon, disabled, onClick } = props;

  return (
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onClick}>
      {text}
      {loading ? <Loader className='l_loader' color='#fff' /> : icon}
    </button>
  );
}
export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, text1 } = props;

  return (
    <div className='a_btn_row'>
      <Button className='a_btn' id='a_btn_save' text={t(text1 )} onClick={onClickCancel} />
    </div>
  )
}