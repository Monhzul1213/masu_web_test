import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';
import { Error, FloatingInput, FloatingPassword, Loader } from '../../components/all';
import { Social } from '../../components/login';

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnter = e => {
    if (e?.key?.toLowerCase() === "enter") {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setLoading(true);
    if(email?.value?.trim() && password?.value?.trim()){
      console.log('call login service');
    } else {
      if(!email?.value?.trim()) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
    setTimeout(() => setLoading(false), 1200);
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, handleEnter };
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
          <button type='submit' className='l_btn' disabled={loading}>
            {loading ? <Loader className='l_loader' color='#fff' /> : t('login.login')}
          </button>
          <div className='l_btn_row'>
            <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
            <Link className='l_link' to='/forgot_password'>{t('login.forgot')}</Link>
          </div>
        </form>
        <Social />
        <div className='l_center_row'>
          <Link className='l_link' to='/sign_up'>{t('login.new_sign')}</Link>
        </div>
      </div>
      <div className='l_link_back'>
        <a className='l_copyright' target="_blank" href={'https://' + t('login.link')} id='l_copy'>{t('login.link')}</a>
        <span className='l_copyright'>{t('login.year')}</span>
      </div>
    </div>
  )
}