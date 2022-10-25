import React, { useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/login.css';
import { login_image } from '../../assets';
import { Button } from '../../components/all';
import { Copyright } from '../../components/login';

export function Confirm(){
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mail = searchParams?.get('mail');
    console.log(mail);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = e => navigate('/');

  return (
    <div className='l_container'>
      <div className='l_back'>
        <img className='l_logo' src={login_image} alt='MASU LOGO' />
        <p className='co_title'>{t('login.congrats')}</p>
        <p className='co_sub'>{t('login.confirmed')}</p>
        <p className='co_text'>{t('login.go_back')}</p>
        <Button className='l_btn' text={t('login.go_back_btn')} onClick={onClick} />
      </div>
      <Copyright />
    </div>
  )
}