import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';

export function Footer(props){
  const { total } = props;
  const { t } = useTranslation();

  return (
    <div className='ps_footer'>
      <p className='ps_footer_label'>{t('order.f_total')}</p>
      <p className='ps_footer_value'>₮{formatNumber(total)}</p>
    </div>
  )
}