import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../all';

export function Footer(props){
  const { total } = props;
  const { t } = useTranslation();

  return (
    <div className='ps_footer'>
      <p className='ps_footer_label'>{t('order.f_total')}</p>
      <p className='ps_footer_value'><Money value={total} fontSize={13} /></p>
    </div>
  )
}