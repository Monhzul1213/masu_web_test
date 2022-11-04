import React from 'react';
import { useTranslation } from 'react-i18next';

export function CardModifier(){
  const { t } = useTranslation();

  return (
    <div className='ac_back'>
      <p className='ac_title'>{t('modifier.title')}</p>
    </div>
  );
}