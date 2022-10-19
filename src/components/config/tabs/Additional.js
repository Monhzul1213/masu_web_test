import React from 'react';
import { useTranslation } from 'react-i18next';

export function Additional(){
  const { t } = useTranslation();
  
  return (
    <div className='c_tab_cont'>
      <p className='c_tab_title'>{t('system_menu.additional')}</p>
      <div className='c_tab_back'>

      </div>
    </div>
  );
}