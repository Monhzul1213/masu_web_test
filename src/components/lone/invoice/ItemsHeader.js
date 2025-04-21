import React from 'react';
import { useTranslation } from 'react-i18next';

export function ItemsHeader(){
  const { t } = useTranslation();

  return (
    <div className='inv_header'>
      <p className='inv_header1' style={{fontWeight: '600', textAlign: 'center'}}>{'№'}</p>
      <p className='inv_header2' style={{fontWeight: '600', textAlign: 'center'}}>{t('menu.inventory')}</p>
      <p className='inv_header3' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.qty')}</p>
      <p className='inv_header4' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.price')}</p>
      <p className='inv_header5' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.amt')}</p>
    </div>
  );
}