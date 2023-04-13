import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/login.css';
import { partnerLogin, setIsLoggedIn, setPartnerLogin } from '../../services';
import { login_image } from '../../assets';
import { Button, Error, FloatingInput, FloatingPassword } from '../../components/all';
import { Copyright, Social } from '../../components/login';

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
        navigate({ pathname: '/' });
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const emailProps = { text: t('login.partner'), value: email, setValue: setEmail, setError, isLogin: true };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError, isLogin: true, handleEnter: handleSubmit };
  const btnProps = { loading, type: 'submit', className: 'l_btn', text: t('login.login') };
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
          <Button {...btnProps} />
          <div className='l_btn_row'>
            <Checkbox {...checkProps}>{t('login.remember')}</Checkbox>
            {/* <span className='l_link' onClick={onForgot}>{t('login.forgot')}</span> */}
          </div>
        </form>
        <Social />
        <div className='l_center_row'>
          <Link className='l_link' to='/partner_sign_up'>{t('login.new_sign')}</Link>
        </div>
      </div>
      <Copyright /> 
    </div>
  );
}