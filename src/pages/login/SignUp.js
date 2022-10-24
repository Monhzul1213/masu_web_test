import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import { login_image } from '../../assets';
import { apiLogin, apiRegister, setIsLoggedIn, setLogin } from '../../services';
import { Button, FloatingInput, FloatingPassword, Error } from '../../components/all';
import { Copyright } from '../../components/login';

export function SignUp(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [business, setBusiness] = useState({ value: '', error: null });
  const [address, setAddress] = useState({ value: null, error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEnter = e => {
    if(e?.key?.toLowerCase() === "enter") {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    let isValid = email?.value?.trim() && password?.value?.trim() && business?.value?.trim() && address?.value?.trim();
    if(isValid){
      setLoading(true);
      let data = { mail: email?.value?.trim(), password: password?.value?.trim(), descr: business?.value?.trim(), address: address?.value?.trim() };
      const response = await dispatch(apiRegister(data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        const response2 = await dispatch(apiLogin(data?.mail, data?.password));
        if(response2?.error) setError(response2?.error);
        else {
          dispatch(setLogin({ toRemember: true }));
          dispatch(setIsLoggedIn(true));
          window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
          navigate({ pathname: '/config' });
        }
      }
      setLoading(false);
    } else {
      if(!email?.value?.trim()) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
      if(!business?.value?.trim()) setBusiness({ value: '', error: t('error.not_empty') });
      if(!address?.value?.trim()) setAddress({ value: '', error: t('error.not_empty') });
    }
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, handleEnter };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, handleEnter };
  const businessProps = { text: t('login.business'), value: business, setValue: setBusiness, setError, handleEnter };
  const addressProps = { text: t('login.address'), value: address, setValue: setAddress, setError, handleEnter };
  const checkProps = { className: 'l_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'l_btn', text: t('login.signup'), disabled: !checked };
  
  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.signup_text')}</p>
        <form onSubmit={handleSubmit}>
          <FloatingInput {...emailProps} />
          <FloatingPassword {...passProps} />
          <FloatingInput {...businessProps} />
          <FloatingInput {...addressProps} />
          <div className='l_check_row'>
            <Checkbox {...checkProps} />
            <p className='l_term'>
              {t('login.sign_accept1')}
              <a className='l_term_link' href='/'>{t('login.sign_accept2')}</a>
              {t('login.sign_accept3')}
              <a className='l_term_link' href='/'>{t('login.sign_accept4')}</a>
              {t('login.sign_accept5')}
            </p>
          </div>
          {error && <Error error={error} />}
          <Button {...btnProps} />
        </form>
        <div className='l_center_row'>
          <p className='l_link_text'>{t('login.go_login')}</p>
          <Link className='l_link' to='/'>{t('login.login')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  )
}