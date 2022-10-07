import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';

export function Login(){
  const { t } = useTranslation();
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.login_text')}</p>
      </div>
    </div>
  )
}