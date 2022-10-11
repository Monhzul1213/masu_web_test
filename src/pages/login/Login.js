import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';
import { Error, FloatingInput, FloatingPassword, Loader } from '../../components/all';

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError };
  const checkProps = { className: 'l_check', checked, onChange: e => setChecked(e?.target?.checked) };
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.login_text')}</p>
        <form onSubmit={handleSubmit}>
          <FloatingInput {...emailProps} />
          <FloatingPassword {...passProps} />
          {error && <Error error={error} />}
          <div className='l_btn_row'>
            <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
            <button type='submit' className='l_btn' disabled={loading}>
              {loading ? <Loader className='l_loader' color='#fff' /> : t('login.login')}
            </button>
          </div>
        </form>
        <Link className='l_link' to='/forgot_password'>{t('login.forgot')}</Link>
        <Link className='l_link' to='/sign_up'>{t('login.new_sign')}</Link>
      </div>
    </div>
  )
}