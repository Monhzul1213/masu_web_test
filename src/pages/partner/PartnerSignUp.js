import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import '../../css/config.css';
import { apiRegister, getService, partnerLogin, setIsLoggedIn, setPartnerLogin } from '../../services';
import { validateEmail, validateNumber } from '../../helpers';
import { header_image } from '../../assets';
import { Button, DynamicAIIcon, DynamicFAIcon, DynamicMDIcon, Error, FloatingInput1, FloatingPassword1 } from '../../components/all';
import { Confirm, Social1 } from '../../components/login';

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
  const navigate = useNavigate();

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
    const response = await dispatch(apiRegister(data, 'Merchant/RegisterPartner'));
    if(response?.error) setError(response?.error);
    else {
      const response2 = await dispatch(partnerLogin(data?.partnerCode, data?.password));
      if(response2?.error) setError(response2?.error);
      else {
        dispatch(setPartnerLogin({ toPartnerRemember: true }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/partner' });
      }
    }
    setLoading(false);
  }

  const codeProps = { text: t('login.partner'), value: code, setValue: setCode, setError, length: 30, Icon: () => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/> };
  const nameProps = { text: t('login.partner_name'), value: name, setValue: setName, setError, Icon: () => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/> };
  const mailProps = { text: t('login.email'), value: mail, setValue: setMail, setError, Icon: () => <DynamicMDIcon className='lg_input_icon' name='MdOutlineMailOutline'/> };
  const phoneProps = { text: t('login.phone'), value: phone, setValue: changePhone, setError, Icon: () => <DynamicAIIcon className='lg_input_icon' name='AiOutlinePhone'/> };
  const addressProps = { text: t('login.partner_address'), value: address, setValue: setAddress, setError, Icon: () => <DynamicFAIcon className='lg_input_icon' name='FaRegAddressCard'/> };
  const passProps = { text: t('login.partner_password'), value: password, setValue: setPassword, setError, handleEnter: handleSubmit };
  const btnProps = { loading, type: 'submit', className: 'lg_login_btn', text: t('login.signup1') };
  const confirmProps = { visible, closeModal, number: phone?.value, expire, email: mail?.value, fromPartner: true };

  return (
    <div className='login_container1'>
      {visible && <Confirm {...confirmProps} />}
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title1'>{t('login.partner_signup')}</p>
      <form onSubmit={handleSubmit} autoComplete='off' style={{width: 400}}>
          <FloatingInput1 {...codeProps}  className='lg_input_back' color='#fff'/>
          <FloatingInput1 {...nameProps} className='lg_input_back' color='#fff'/>
          <FloatingInput1 {...mailProps} className='lg_input_back' color='#fff'/>
          <FloatingInput1 {...phoneProps} className='lg_input_back' color='#fff'/>
          <FloatingInput1 {...addressProps} className='lg_input_back' color='#fff'/>
          <FloatingPassword1 {...passProps} className='lg_input_back' classIcon='lg_input_icon' classShow='lg_input_show' color='#fff'/>
          {error && <Error error={error} />}
          <Button {...btnProps} />
      </form>
      <div style={{padding: 10}} />
      <div className='l_center_row'>
        <p className='l_link_text'>{t('login.go_login')}</p>
        <Link className='login_link1' to='/partner_sign_in'>{t('login.login')}</Link>
      </div>
      <div style={{flex: 1}} />
      <p className='lg_footer'>masu cloud platform</p>
      <div style={{padding: 10}} />
      <Social1 />
    </div>
  );
}