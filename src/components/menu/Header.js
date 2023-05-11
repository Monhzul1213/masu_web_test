import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/menu.css';
import { header_image } from '../../assets';
import { DynamicMDIcon } from '../all';

export function Header(props){
  const { collapsed, setCollapsed } = props;
  const { pathname } = useLocation();
  const { i18n, t } = useTranslation();
  const [title, setTitle] = useState('Home');
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    i18n.exists('header.' + pathname) ? setTitle('header.' + pathname) : setTitle('header./');
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order'));
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onClick = () => setCollapsed(!collapsed);

  return hideMenu ? null : (
    <div className='h_container'>
      <button className='h_icon_btn' onClick={onClick}>
        <DynamicMDIcon name='MdOutlineMenu' className='h_icon' />
      </button>
      <p className='h_title'>{t(title)}</p>
      <img className='h_logo' src={header_image} alt='Logo' />
    </div>
  );
}