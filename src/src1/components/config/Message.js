import React from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicBSIcon  } from '../all/all_m/DynamicIcon';

export function Message(props){
  const { icon } = props;
  const { t } = useTranslation(); 

  return (
    <div className='empty_back1'>
      <div className='empty_icon_back'>
        <DynamicBSIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_descr'>{t('orders.msg')}</p>
    </div>
  )
}