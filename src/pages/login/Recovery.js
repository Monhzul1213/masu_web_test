import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import '../../css/config.css';
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

  const onClick = async e => {
    setLoading(true);
    setError(null);
    const response = await dispatch(apiRecovery(value?.value));
    if(response?.error) setError(response?.error);
    else setSent(true);
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
        {sent && <div className='co_sent_back'>
          <p className='co_sent_text'>{t('login.sent')}</p>
        </div>}
        <div className='l_center_row'>
          <Link className='l_link' to='/'>{t('login.back')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  )
}