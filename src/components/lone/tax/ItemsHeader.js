import React from 'react';
import { useTranslation } from 'react-i18next';

export function ItemsHeader(){
  const { t } = useTranslation();

  return (
    <div className='inv_header'>
      <p className='tax_header1' style={{fontWeight: '600', textAlign: 'center'}}>{'№'}</p>
      <p className='tax_header2' style={{fontWeight: '600', textAlign: 'center'}}>{t('menu.inventory')}</p>
      <p className='tax_header6' style={{fontWeight: '600', textAlign: 'center'}}>{t('inventory.barcode')}</p>
      <p className='tax_header3' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.qty')}</p>
      <p className='tax_header4' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.price')}</p>
      <p className='tax_header5' style={{fontWeight: '600', textAlign: 'center'}}>{t('report_receipt.amt')}</p>
    </div>
  );
}