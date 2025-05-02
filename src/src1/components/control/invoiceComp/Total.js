import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../../components/all';

export function Total(props){
  const { header } = props;
  const { t } = useTranslation();

  return (
    <div className='inv_total_back'>
      {/* <div className='inv_footer'>
        <div className='bo_footer0' />
        <p className='inv_footer1'>{t('discount.amount')}</p>
        <p className='inv_footer2'><Money value={header?.pureAmount} fontSize={13} currency='₮' /></p>
      </div> */}
      <div className='inv_tot_back'>
        <p className='inv_footer1' style={{fontSize: 10}}>{t('pos.t_noat')}</p>
        <p className='inv_footer2' style={{fontSize: 10}}><Money value={header?.totalVatAmount} fontSize={11} currency='₮' /></p>
      </div>
      <div className='inv_tot_back1'>
        <p className='inv_footer1' style={{fontSize: 10}}>{t('report.amount')}</p>
        <p className='inv_footer2' style={{fontSize: 10}}><Money value={header?.totalAmount ?? '130000'} fontSize={11} currency='₮' /></p>
      </div>
    </div>
  );
}