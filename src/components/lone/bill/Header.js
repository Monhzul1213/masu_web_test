import React from 'react';
import { useTranslation } from 'react-i18next';

export function Header(){
  const { t } = useTranslation();

  return (
    <div className='bl_header'>
      <p className='bl_header1'>{t('bill.invt')}</p>
      <p className='bl_header2'>{t('bill.qty')}</p>
      <p className='bl_header3'>{t('bill.price')}</p>
      <p className='bl_header4'>{t('bill.amt')}</p>
    </div>
  );
}