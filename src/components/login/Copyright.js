import React from 'react';
import { useTranslation } from 'react-i18next';

export function Copyright(){
  const { t } = useTranslation();
  
  return (
    <div className='l_link_back'>
      <a className='l_copyright' target='_blank' rel='noreferrer' href={'https://' + t('login.link')} id='l_copy'>{t('login.link')}</a>
      <span className='l_copyright'>{t('login.year')}</span>
    </div>
  );
}