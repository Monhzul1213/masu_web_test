import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../components/all';

export function Total(props){
  const { header } = props;
  const { t } = useTranslation();

  return (
    <div className='inv_total_back'>
      <div className='inv_footer'>
        <div className='bo_footer0' />
        <p className='tax_footer1'>{t('report.amount')}</p>
        <p className='tax_footer2'><Money value={header?.totalAmount} fontSize={13} currency='₮' /></p>
      </div>
    </div>
  );
}