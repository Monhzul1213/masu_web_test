import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../all';

export function Footer(props){
  const { total } = props;
  const { t } = useTranslation();

  return (
    <div className='ps_footer_back'>
      <div className='ps_footer'>
        <p className='ps_footer_label'>{t('order.f_total')}</p>
        <p className='ps_footer_value'><Money value={total?.total} fontSize={13} /></p>
      </div>
     {total?.discount ? <div className='ps_footer'>
        <p className='ps_footer_label'>{t('order.discount')}</p>
        <p className='ps_footer_value'><Money value={total?.discount} fontSize={13} /></p>
      </div> : null}
      {total?.discount ? <div className='ps_footer'>
        <p className='ps_footer_label'>{t('order.to_pay')}</p>
        <p className='ps_footer_value'><Money value={total?.left} fontSize={13} /></p>
      </div> : null}
    </div>
  )
}