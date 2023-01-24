import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import emailjs from '@emailjs/browser';

import '../../css/login.css';
import '../../css/config.css';
import { config } from '../../helpers';
import { apiRecovery } from '../../services';
import { login_image } from '../../assets';
import { Button, Error, Input } from '../../components/all';
import { Copyright } from '../../components/login';

export function Recovery(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState({ value: '' });
  const [sent, setSent] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let email = searchParams?.get('email');
    setValue({ value: email ?? '' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendEmail = async to => {
    const link = config?.domain + '/confirm?mail=' + to;
    const templateParams = { to, link };
    return emailjs.send('service_k7osau81','template_3dlaawl', templateParams, 'q2YX3XN0cT2C8g_Ni')
      .then((response) => {
        message.success(t('login.success'));
      }, (err) => {
        console.log(err);
        setError(t('login.send_error'));
      }
    );
  }

  const onClick = async e => {
    setLoading(true);
    setError(null);
    const response = await dispatch(apiRecovery(value?.value));
    if(response?.error) setError(response?.error);
    else await sendEmail();
    setLoading(false);
  }

  let mailProps = { value, setValue, placeholder: t('login.email'), setError, handleEnter: onClick,
    className: 'cfcode_input', classBack: 'co_input_back' }

  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <div className='co_gap' />
        <p className='co_sub'>{t('login.recovery')}</p>
        <Input {...mailProps} />
        <Button className='l_btn' text={t('login.send')} onClick={onClick} loading={loading} />
        {error && <Error error={error} />}
        <div className='co_gap' />
        <div className='l_center_row'>
          <Link className='l_link' to='/'>{t('login.back')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  )
}