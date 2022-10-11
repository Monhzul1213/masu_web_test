import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';
import { FloatingInput, FloatingPassword } from '../../components/all';

export function SignUp(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [business, setBusiness] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }
  
  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError };
  const businessProps = { text: t('login.password'), value: business, setValue: setBusiness, setError };
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.signup_text')}</p>
        <form onSubmit={handleSubmit}>
          <FloatingInput {...emailProps} />
          <FloatingPassword {...passProps} />

        </form>
      </div>
    </div>
  )
}