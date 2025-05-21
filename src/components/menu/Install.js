import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import OpenApp from "react-open-app";
import customProtocolCheck from "custom-protocol-check";
import { useSelector, useDispatch } from 'react-redux';

import { getOS } from '../../helpers';
import { image15, image23, image24, image25 } from '../../assets';
import { getList } from '../../services';
import { Button } from '../all';
import { useNavigate } from 'react-router-dom';

export function Install(props){
  const { collapsed } = props;
  const { t } = useTranslation();
  const [type, setType] = useState(null);

  useEffect(() => {
    setType(getOS());
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = async () => {
    let scheme = (type === 'iOS' || type === 'Android') ? "masuapp://" : "MASU:"
    let url = type === 'Android'
      ? "https://play.google.com/store/apps/details?id=com.masupos"
      : type === 'iOS'
        ? "https://apps.apple.com/mn/app/masupos/id1671694304"
        : "https://app.masu.mn/files/MasuInstaller.exe"
    let now = new Date().valueOf();
    if(type === 'Android'){
      customProtocolCheck(scheme,
        () => { window.open(url) },
        () => { },
        1500
      );
    } else if(type === 'iOS') {
      setTimeout(function () {
        if (new Date().valueOf() - now > 1500) return;
          window.open(url)
        }, 1200);
      window.location = scheme;
    } else {
      checkCustomProtocol(scheme, url, 1600)
    }
  }

  function checkCustomProtocol(inProtocol, inInstalLink, inTimeOut){
    var timeout = inTimeOut;
    window.addEventListener('blur',function(e) {
      window.clearTimeout(timeout);
    });
    timeout = window.setTimeout(function() {
      window.location = inInstalLink;
    }, inTimeOut);
    window.location = inProtocol;
  }

  return (
    <button className='mi_btn' onClick={onClick}>
      <img src={image15} alt='image15' className='pos_image_back'/>
      {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
    </button>
  )

  // return type === 'iOS' || type === 'Android' ?  (
  //   <OpenApp
  //     href="masuapp://"
  //     android="masuapp://"
  //     ios="masuapp://">
  //     <div className='mi_btn'>
  //       <AiOutlineAppstore className='mi_icon' />
  //       {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
  //     </div>
  //   </OpenApp>
  // ) : (
  //   <a className='mi_btn' href='MASU:'>
  //     <AiOutlineAppstore className='mi_icon' />
  //     {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
  //   </a>
  // );
}

export function MenuPayment(props){
  const { collapsed } = props;
  const [subscriptionType, setSubscriptionType] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setSubscriptionType(response?.data?.subscriptionType)
  };

  const onClick = () => navigate({pathname: 'config/type'});

  const btnProps = { text: t('control.extend'), className: 'menu_sub_btn', onClick, id: subscriptionType === 'FREE' ? '' : 'menu_sub_btn1'};

  return (
    <div className='menu_sub_back'>
      <div className='menu_sub_row'>
          <img src={subscriptionType === 'PREMIUM' ? image23 : subscriptionType === 'STANDARD' ? image24 : image25} alt={subscriptionType}/>
          {!collapsed && <p className='menu_sub_text'>{subscriptionType === 'PREMIUM' ? 'Premium' : subscriptionType === 'STANDARD' ? 'Standard' : ''}</p>}
      </div>
      {!collapsed && <p className='menu_sub_text1' style={subscriptionType === 'FREE' ? {} : {margin: '20px 0'}}>
        {subscriptionType === 'FREE' ? t('control.extend1') : (t('control.time') + 5 + t('control.end'))}
      </p>}
      {!collapsed && <Button {...btnProps}/>}
    </div>
  )
}