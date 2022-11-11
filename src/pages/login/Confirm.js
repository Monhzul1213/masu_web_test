import React, { useState } from 'react';
import { message } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import { login_image } from '../../assets';
import { Button, Error } from '../../components/all';
import { Copyright } from '../../components/login';
import { apiValidate } from '../../services';

export function Confirm(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClick = async e => {
    setLoading(true);
    setError(null);
    let mail = searchParams?.get('mail');
    const response = await dispatch(apiValidate(mail));
    message.success(response?.response);
    navigate('/');
    setLoading(false);
  }

  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='co_title'>{t('login.congrats')}</p>
        <p className='co_sub'>{t('login.confirmed')}</p>
        <p className='co_text'>{t('login.go_back')}</p>
        <Button className='l_btn' text={t('login.go_back_btn')} onClick={onClick} loading={loading} />
        {error && <Error error={error} />}
      </div>
      <Copyright />
    </div>
  )
}