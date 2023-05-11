
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../all';

export function Sign(){
  const { t } = useTranslation();

  return (
    <div>
      <p className='bo_sign'>{t('order_bill.received')} ......................................../                                                       /</p>
      <p className='bo_sign'>{t('order_bill.given')} ......................................../                                                       /</p>
      <p className='bo_sign'>{t('order_bill.checked')} ......................................../                                                       /</p>
    </div>
  );
}