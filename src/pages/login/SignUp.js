import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { Link, useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import emailjs from '@emailjs/browser';

import '../../css/login.css';
import { login_image } from '../../assets';
import { config, validateEmail, validateNumber } from '../../helpers';
import { apiLogin, apiRegister, getService, setIsLoggedIn, setLogin } from '../../services';
import { Button, FloatingInput, FloatingPassword, Error } from '../../components/all';
import { Copyright } from '../../components/login';
import { Confirm } from '../../components/login/Confirm';

export function SignUp(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [business, setBusiness] = useState({ value: '', error: null });
  const [address, setAddress] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expire, setExpire] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkValid = () => {
    let passwordLength = 8, businessLength = 6;
    let isValid = email?.value && password?.value && business?.value && address?.value?.trim();
    let isEmailValid = validateEmail(email?.value);
    let isPasswordValid = password?.value?.length >= passwordLength;
    let isBusinessValid = business?.value?.length >= businessLength;
    let isAddressValid = validateNumber(address?.value?.trim());
    if(isValid && isEmailValid && isPasswordValid && isBusinessValid && isAddressValid){
      return true;
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setEmail({ value: email?.value, error: t('error.be_right') });
      if(!password?.value) setPassword({ value: '', error: t('error.not_empty') });
      else if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
      if(!business?.value) setBusiness({ value: '', error: t('error.not_empty') });
      else if(!isBusinessValid) setBusiness({ value: business?.value, error: ' ' + businessLength + t('error.longer_than') });
      if(!address?.value?.trim()) setAddress({ value: '', error: t('error.not_empty') });
      else if(!isAddressValid) setAddress({ value: address?.value?.trim(), error: t('error.be_right') });
      return false;
    }
  }

  const sendEmail = async to => {
    const link = config?.domain + '/confirm?mail=' + to;
    const templateParams = { to, link };
    return emailjs.send('service_k7osau8','template_3dlaawl', templateParams, 'q2YX3XN0cT2C8g_Ni')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        return Promise.resolve(true);
      }, (err) => {
        console.log(err);
        return Promise.resolve(true);
      }
    );
  }

  const sendSMS = async () => {
    const diff = expire - new Date();
    if(expire && diff > 0){
      setVisible(true);
    } else {
      setLoading(true);
      let api = 'Merchant/SentSMS?mobile=' + address?.value?.trim() + '&email=' + email?.value?.trim();
      let response = await dispatch(getService(api));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        setExpire(time);
        setVisible(true);
      }
    }
  }

  const login = async () => {
    setLoading(true);
    let data = { mail: email?.value, password: password?.value, descr: business?.value, address: address?.value?.trim() };
    const response = await dispatch(apiRegister(data));
    console.log(response);
    if(response?.error) setError(response?.error);
    else {
      await sendEmail(data?.mail);
      const response2 = await dispatch(apiLogin(data?.mail, data?.password));
      if(response2?.error) setError(response2?.error);
      else {
        dispatch(setLogin({ toRemember: true }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/config', search: createSearchParams({ mode: 'is_first' }).toString() });
      }
    }
    setLoading(false);
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      sendSMS();
    }
  }

  const closeModal = sure => {
    setVisible(false);
    if(sure) login();
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError };
  const businessProps = { text: t('login.business'), value: business, setValue: setBusiness, setError };
  const addressProps = { text: t('login.phone'), value: address, setValue: setAddress, setError, handleEnter: checked && handleSubmit };
  const checkProps = { className: 'l_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'l_btn', text: t('login.signup'), disabled: !checked };
  const confirmProps = { visible, closeModal, number: address?.value, expire, email: email?.value };
  
  return (
    <div className='l_container'>
      {visible && <Confirm {...confirmProps} />}
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