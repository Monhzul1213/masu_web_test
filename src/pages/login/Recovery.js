import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import '../../css/login.css';
import '../../css/config.css';
import { apiRecovery } from '../../services';
import { header_image, login1, login2, login3, login4 } from '../../assets';
import { Button, Error, FloatingInput1 } from '../../components/all';
import { Copyright } from '../../components/login';
import BackgroundSlider from 'react-background-slider';

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
    className: 'cfcode_input1', classBack: 'co_input_back' }

  return (
    <div className='login_container'>
      <BackgroundSlider className='login_container' images= {[login1, login2, login3, login4]} duration={100} transition={2}/>
      <div className='login_back'>
        <img className='login_logo' src={header_image} alt='MASU LOGO' />
        <div className='co_gap' />
        <p className='co_sub1'>{t('login.recovery')}</p>
        <div style={{width: 300}}>
          <FloatingInput1 {...mailProps} />
          <Button className='login_btn1' text={t('login.send')} onClick={onClick} loading={loading} />
        </div>
        {error && <Error error={error} />}
        <div className='co_gap' />
        {sent && <div className='co_sent_back'>
          <p className='co_sent_text'>{t('login.sent')}</p>
        </div>}
        <div className='l_center_row'>
          <Link className='login_link' to='/'>{t('login.back')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  )
}