import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import { apiRegister, getService } from '../../services';
import { validateEmail, validateNumber } from '../../helpers';
import { login_image } from '../../assets';
import { Button, Error, FloatingInput, FloatingPassword } from '../../components/all';
import { Confirm, Copyright } from '../../components/login';

export function PartnerSignUp(){
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [password, setPassword] = useState({ value: '' });
  const [expire, setExpire] = useState(null);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const sendSMS = async () => {
    const diff = expire - new Date();
    if(expire && diff > 0){
      setVisible(true);
    } else {
      setLoading(true);
      let api = 'Merchant/SentSMS?mobile=' + phone?.value + '&email=' + mail?.value + '&RegisterType=Partner';
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

  const checkValid = () => {
    let isValid = code?.value && name?.value && mail?.value && phone?.value && password?.value;
    let isEmailValid = !mail?.value || validateEmail(mail?.value);
    let isPhoneValid = validateNumber(phone?.value);
    if(isValid && isEmailValid && isPhoneValid){
      return true;
    } else {
      if(!code?.value) setCode({ value: '', error: t('error.not_empty') });
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!mail?.value) setMail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setMail({ value: mail?.value, error: t('error.be_right') });
      if(!phone?.value) setPhone({ value: '', error: t('error.not_empty') });
      else if(!isPhoneValid) setPhone({ value: phone?.value, error: t('error.be_right') });
      if(!password?.value) setPassword({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      sendSMS();
    }
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setPhone({ value: text });
  }

  const closeModal = sure => {
    setVisible(false);
    if(sure) login();
  }

  const login = async () => {
    setLoading(true);
    let data = {
      partnerCode: code?.value, partnerName: name?.value, email: mail?.value,
      phone: phone?.value, address: address?.value, password: password?.value?.trim()
    };
    console.log(data);
    const response = await dispatch(apiRegister(data, 'Merchant/RegisterPartner'));
    console.log(response);
    if(response?.error) setError(response?.error);
    else {
    //   dispatch(setLogin({ toRemember: true }));
    //   dispatch(setIsLoggedIn(true));
    //   window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
    //   navigate({ pathname: '/config', search: createSearchParams({ mode: 'is_first' }).toString() });
    }
    setLoading(false);
  }

  const codeProps = { text: t('login.partner'), value: code, setValue: setCode, setError, length: 30 };
  const nameProps = { text: t('login.partner_name'), value: name, setValue: setName, setError };
  const mailProps = { text: t('login.email'), value: mail, setValue: setMail, setError };
  const phoneProps = { text: t('login.phone'), value: phone, setValue: changePhone, setError };
  const addressProps = { text: t('login.partner_address'), value: address, setValue: setAddress, setError };
  const passProps = { text: t('login.partner_password'), value: password, setValue: setPassword, setError, handleEnter: handleSubmit };
  const btnProps = { loading, type: 'submit', className: 'l_btn', text: t('login.signup') };
  const confirmProps = { visible, closeModal, number: phone?.value, expire, email: mail?.value };

  return (
    <div className='l_container'>
      {visible && <Confirm {...confirmProps} />}
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='l_text'>{t('login.partner_signup')}</p>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <FloatingInput {...codeProps} />
          <FloatingInput {...nameProps} />
          <FloatingInput {...mailProps} />
          <FloatingInput {...phoneProps} />
          <FloatingInput {...addressProps} />
          <FloatingPassword {...passProps} />
          {error && <Error error={error} />}
          <Button {...btnProps} />
        </form>
        <div className='l_center_row'>
          <p className='l_link_text'>{t('login.go_login')}</p>
          <Link className='l_link' to='/partner_sign_in'>{t('login.login')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  );
}