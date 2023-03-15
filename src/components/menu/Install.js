import React, { useEffect, useState } from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
// import OpenApp from "react-open-app";
import customProtocolCheck from "custom-protocol-check";

import { getOS } from '../../helpers';

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
      <AiOutlineAppstore className='mi_icon' />
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