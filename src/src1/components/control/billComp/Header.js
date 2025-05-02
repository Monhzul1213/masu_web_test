import React from 'react';
import { useTranslation } from 'react-i18next';

export function Header(){
  const { t } = useTranslation();

  return (
    <div className='bl_header'>
      <p className='bl_header1' style={{fontSize: 11, width: '40%'}}>{t('bill.invt')}</p>
      <p className='bl_header2' style={{fontSize: 11, width: '15%'}}>{t('bill.qty')}</p>
      <p className='bl_header3' style={{fontSize: 11, width: '20%'}}>{t('bill.price')}</p>
      <p className='bl_header4' style={{fontSize: 11, width: '25%'}}>{t('bill.amt')}</p>
    </div>
  );
}