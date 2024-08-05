import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundSlider from 'react-background-slider'

import '../../css/login.css';
import { apiLogin, setIsLoggedIn, setLogin } from '../../services';
import { header_image, login1, login2, login3, login4, login_image } from '../../assets';
import { Button, DynamicAIIcon, Error, FloatingInput, FloatingInput1, FloatingPassword, FloatingPassword1 } from '../../components/all';
import { Social, Copyright, Social1 } from '../../components/login';

export function LoginOld(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { webUser, toRemember }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(webUser?.mail) setEmail({ value: webUser?.mail });
    if(toRemember && webUser?.password) setPassword({ value: webUser?.password });
    if(toRemember) setChecked(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(email?.value && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(apiLogin(email?.value, password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        dispatch(setLogin({ toRemember: checked }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: response?.isAdmin ? '/system/invoice' : webUser?.msMerchant?.merchantType === 0 ? '/profile' : 
        response?.viewReport ? '/report/report_sales' : '/config'});
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const onForgot = () => {
    navigate({ pathname: "/recovery", search: createSearchParams({ email: email?.value }).toString()});
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, isLogin: true };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, isLogin: true, handleEnter: handleSubmit };
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
            <span className='l_link' onClick={onForgot}>{t('login.forgot')}</span>
          </div>
        </form>
        <Social />
        <div className='l_center_row'>
          <Link className='l_link' to='/sign_up'>{t('login.new_sign')}</Link>
          {/* <a className='l_link' target='_blank' rel='noreferrer' href={'https://' + t('login.link')}>{t('login.new_sign')}</a> */}
        </div>
      </div>
      <Copyright />
    </div>
  )
}

export function LoginOld2(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { webUser, toRemember }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(webUser?.mail) setEmail({ value: webUser?.mail });
    if(toRemember && webUser?.password) setPassword({ value: webUser?.password });
    if(toRemember) setChecked(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(email?.value && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(apiLogin(email?.value, password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        dispatch(setLogin({ toRemember: checked }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: response?.isAdmin ? '/system/invoice' : webUser?.msMerchant?.merchantType === 0 ? '/profile' : 
        response?.viewReport ? '/report/report_sales' : '/config'});
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const onForgot = () => {
    navigate({ pathname: "/recovery", search: createSearchParams({ email: email?.value }).toString()});
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, isLogin: true, Icon: () => <DynamicAIIcon className='f_input_icon' name='AiOutlineUser'/> };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, isLogin: true, handleEnter: handleSubmit };
  const checkProps = { className: 'login_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'login_btn', text: t('login.login') };
  
  return (
    <div className='login_container'>
      <BackgroundSlider className='login_container' images= {[login1, login2, login3, login4]} duration={100} transition={2}/>
      <div className='login_back'>
        <img className='login_logo' src={header_image} alt='MASU LOGO' />
        <p className='login_text'>{t('login.login_text')}</p>
        <form onSubmit={handleSubmit} style={{width: '330px'}}>
          <FloatingInput1 {...emailProps} />
          <FloatingPassword1 {...passProps} />
          {error && <Error error={error} />}
          <div className='login_btn_row'>
            <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
            <span className='login_link' onClick={onForgot}>{t('login.forgot')}</span>
          </div>
          <Button {...btnProps} />
        </form>
        <div className='login_center_row'>
          <Link className='login_link' to='/sign_up'>{t('login.new_sign')}</Link>
          {/* <a className='l_link' target='_blank' rel='noreferrer' href={'https://' + t('login.link')}>{t('login.new_sign')}</a> */}
        </div>
      </div>
        <Social /> 
        <Copyright />
    </div>
  )
}

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { webUser, toRemember }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(webUser?.mail) setEmail({ value: webUser?.mail });
    if(toRemember && webUser?.password) setPassword({ value: webUser?.password });
    if(toRemember) setChecked(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(email?.value && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(apiLogin(email?.value, password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        dispatch(setLogin({ toRemember: checked }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: response?.isAdmin ? '/system/invoice' : webUser?.msMerchant?.merchantType === 0 ? '/profile' : 
        response?.viewReport ? '/report/report_sales' : '/config'});
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const onForgot = () => {
    navigate({ pathname: "/recovery", search: createSearchParams({ email: email?.value }).toString()});
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, isLogin: true, Icon: () => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/> };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, isLogin: true, handleEnter: handleSubmit };
  const checkProps = { className: 'login_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'lg_login_btn', text: t('login.login1') };
   
  return (
    <div className='login_container1'>
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title'>Welcome <span className='lg_title2'>Back</span>!</p>
      <form onSubmit={handleSubmit} style={{width: '330px'}}>
        <FloatingInput1 {...emailProps} className='lg_input_back' color='#fff' />
        <FloatingPassword1 {...passProps} className='lg_input_back' classIcon='lg_input_icon' classShow='lg_input_show' color='#fff' />
        {error && <Error error={error} id='lg_error' />}
        <Button {...btnProps} />
        <div className='login_btn_row'>
          <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
          <span className='lg_login_link' onClick={onForgot}>{t('login.forgot')}</span>
        </div>
        <div style={{padding: 10}} />
        <div className='login_center_row'>
          <Link className='lg_login_link' to='/sign_up'>{t('login.new_sign')}</Link>
        </div>
      </form>
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_footer'>masu cloud platform</p>
      <div style={{padding: 10}} />
      <Social1 />
    </div>
  )
}