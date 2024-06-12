import React from 'react';
import { useTranslation } from 'react-i18next';

export function Header(){
  const { t } = useTranslation();

  return (
    <div className='bo_header'>
      <p className='bo_header1'>{t('order_bill.t_invt')}</p>
      <p className='bo_header2'>{t('order_bill.t_barcode')}</p>
      <p className='bo_header3'>{t('order_bill.t_qty')}</p>
      <p className='bo_header4'>{t('order_bill.t_price')}</p>
      <p className='bo_header5'>{t('order_bill.t_total')}</p>
    </div>
  );
}