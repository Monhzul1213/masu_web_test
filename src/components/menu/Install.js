import React, { useEffect, useState } from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import OpenApp from "react-open-app";

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

  return type === 'iOS' || type === 'Android' ?  (
    <OpenApp
      href="masuapp://"
      android="masuapp://"
      ios="masuapp://">
      <div className='mi_btn'>
        <AiOutlineAppstore className='mi_icon' />
        {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
      </div>
    </OpenApp>
  ) : (
    <a className='mi_btn' href='MASU:'>
      <AiOutlineAppstore className='mi_icon' />
      {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
    </a>
  );
}