import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';

import '../../css/menu.css';
import { header_image, image16, image17, image19, image20, image21, image22 } from '../../assets';
import { Button, DynamicMDIcon, Language } from '../all';
import { useDispatch, useSelector } from 'react-redux';
import { getList, logout, setIsLoggedIn } from '../../services';

export function Header(props){
  const { collapsed, setCollapsed } = props;
  const { pathname } = useLocation();
  const { i18n, t } = useTranslation();
  const [title, setTitle] = useState('Home');
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    i18n.exists('header.' + pathname) ? setTitle('header.' + pathname) : setTitle('header./');
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order')) || pathname1?.includes('statement');
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

export function Header1(props){
  const { pathname } = useLocation();
  const { i18n, t } = useTranslation();
  const [title, setTitle] = useState('Home');
  const [hideMenu, setHideMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(false);
  const { user, isOwner, isPartner, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.exists('header.' + pathname) ? setTitle('header.' + pathname) : setTitle('header./');
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order')) || pathname1?.includes('statement') || pathname1?.includes('inv_pdf');
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setSubscriptionType(response?.data?.subscriptionType)
  };

  const onClickAccount = e => {
    navigate('/profile');
    setOpen(false);
  }

  const onClickSignout = e => {
    e?.preventDefault();
    dispatch(logout());
    dispatch(setIsLoggedIn(false));
    window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
    window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
    window.localStorage.removeItem('CREDENTIALS_FLUSH');
    navigate(isPartner ? 'partner_sign_in' : '/');
  }

  const onClick = () => navigate('/config/type');


  const menu = () => {
    return (
      <div className='p_menu'>
        <Button className='p_menu_btn' text={t('profile.account')} onClick={onClickAccount} disabled={!isOwner} />
        <Button className='p_menu_btn' text={t('profile.signout')} onClick={onClickSignout} />
      </div>
    );
  }

  return hideMenu ? null : (
    <div className='menu_pro_container'>
      <p className='h_title'>{t(title)}</p>
      <Dropdown overlay={menu} trigger='click' open={open} onOpenChange={setOpen}>
      <div className='p_btn'>
          {<img className='img_header' src={ subscriptionType === 'PREMIUM' ?  image16 : subscriptionType === 'STANDARD' ? image21 : image22 } alt='image17'/>}
          <div className='p_side'>
            <div className='header_img_back'>
              <p className='p_title'>{t('menu.profile')}</p>
              {<img className='type_img' onClick={onClick} src={subscriptionType === 'PREMIUM' ? image17 : subscriptionType === 'STANDARD' ? image19 : image20 } alt='image16'/>}
            </div>
            <p className='p_user'>{user?.mail?.toLowerCase()}</p>
            <DynamicMDIcon onClick={e => e.preventDefault()} name='MdKeyboardArrowDown' size={20} className='down_icon_back'/>
          </div>
      </div>
      </Dropdown>
      <div className='login_language_back1'>
          <Language id='login_language1' home= {true}/>
      </div>
    </div>
  );
}