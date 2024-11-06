import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/login.css';
import { partnerLogin, setIsLoggedIn, setPartnerLogin } from '../../services';
import { header_image } from '../../assets';
import { Button, DynamicAIIcon, Error, FloatingInput1, FloatingPassword1, LanguageLogin } from '../../components/all';
import { Social1 } from '../../components/login';

export function PartnerLogin(){
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [checked, setChecked] = useState(false);
  const { partnerUser, toPartnerRemember }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(partnerUser?.partnerCode) setEmail({ value: partnerUser?.partnerCode });
    if(toPartnerRemember && partnerUser?.password) setPassword({ value: partnerUser?.password });
    if(toPartnerRemember) setChecked(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(email?.value && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(partnerLogin(email?.value, password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        dispatch(setPartnerLogin({ toPartnerRemember: checked }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/partner' });
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const onForgot = () => {
    navigate({ pathname: "/recovery", search: createSearchParams({ email: email?.value }).toString()});
  };

  const emailProps = { text: t('login.partner'), value: email, setValue: setEmail, setError, isLogin: true, Icon: () => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/> };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, isLogin: true, handleEnter: handleSubmit };
  const btnProps = { loading, type: 'submit', className: 'lg_login_btn', text: t('login.login1') };
  const checkProps = { className: 'lg_login_check', checked, onChange: e => setChecked(e?.target?.checked) };

  return (
    <div className='login_container1'>
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <div className='login_language_back'>
        <LanguageLogin id='login_language' />
      </div>
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title'>Welcome <span className='lg_title2'>Back</span>!</p>
        <form onSubmit={handleSubmit} style={{width: '330px'}}>
          <FloatingInput1 {...emailProps} classBack='lg_input_container' className='lg_input_back' color='#fff' />
          <FloatingPassword1 {...passProps} classBack='lg_input_container' className='lg_input_back' classIcon='lg_input_icon' classShow='lg_input_show' color='#fff'/>
          {error && <Error error={error} id='lg_error' />}
          <Button {...btnProps} />
          <div className='login_btn_row'>
            <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
            <span className='lg_login_link' onClick={onForgot}>{t('login.forgot')}</span>
          </div>
          <div style={{padding: 10}} />
          <div className='login_center_row'>
            <Link className='lg_login_link2' to='/partner_sign_up'>{t('login.new_sign')}</Link>
          </div>
        </form>
        <div style={{padding: 10}} />
        <div style={{flex: 1}} />
        <p className='lg_footer'>masu cloud platform</p>
        <div style={{padding: 10}} />
        <Social1 />
    </div>
  );
}