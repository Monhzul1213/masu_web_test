import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';
import { FloatingInput, FloatingPassword } from '../../components/all';

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.login_text')}</p>
        <form>
          <FloatingInput text={t('login.email')} value={email} setValue={setEmail} setError={setError} />
          <FloatingPassword text={t('login.password')} value={password} setValue={setPassword} setError={setError} />
        </form>
      </div>
    </div>
  )
}