import React from 'react';
import { useTranslation } from 'react-i18next';

export function Header(){
  const { t } = useTranslation();

  return (
    <div className='bo_header'>
      <p className='in_header1'>{t('system.id')}</p>
      <p className='in_header2'>{t('system.service_name')}</p>
      <p className='in_header3'>{t('discount.amount')}</p>
    </div>
  );
}