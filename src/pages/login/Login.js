import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import '../../css/login.css';
import { apiLogin } from '../../services';
import { login_image } from '../../assets';
import { Button, Error, FloatingInput, FloatingPassword } from '../../components/all';
import { Social, Copyright } from '../../components/login';

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
    console.log('5-------------------')
    
    const config = {
      method: 'POST',
      url: 'http://192.168.1.104:8282/Merchant/login',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      }, 
      data: {
        mail: 'hashaasuna@gmail.com', password: '123'
      }
    };
    axios(config)
      .then(res => console.log('1----', res))
      .catch(err => console.log('2----', err?.message));

    return;
    if(email?.value?.trim() && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(apiLogin(email?.value?.trim(), password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        // dispatch(setLogin({ toRemember: checked }));
        // dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/' });
      }
      setLoading(false);
    } else {
      if(!email?.value?.trim()) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, handleEnter };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError };
  const checkProps = { className: 'l_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'l_btn', text: t('login.login') };
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.login_text')}</p>
        <form onSubmit={handleSubmit}>
          <FloatingInput {...emailProps} />
          <FloatingPassword {...passProps} />
          {error && <Error error={error} />}
          <Button {...btnProps} />
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
      <Copyright />
    </div>
  )
}