import React from 'react';
import { useTranslation } from 'react-i18next';

import { Title } from './Title';

export function Card(){
  const { t } = useTranslation();

  const systemProps = { title: t('config.config'), sub_title: t('config.system_config'), icon: 'BsGear' };//BsShop

  return (
    <div className='c_card_back'>
      <Title {...systemProps} />
    </div>
  );
}