import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { RiUserSettingsLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout, setIsLoggedIn } from '../../services';
import { Button } from '../all/Button';
import { DynamicMDIcon } from '../all';
import { header_image } from '../../assets';

export function Profile(props){
  const { collapsed } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user, isOwner, isPartner } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const menu = () => {
    return (
      <div className='p_menu'>
        <Button className='p_menu_btn' text={t('profile.account')} onClick={onClickAccount} disabled={!isOwner} />
        <Button className='p_menu_btn' text={t('profile.signout')} onClick={onClickSignout} />
      </div>
    );
  }
  
  return (
    <Dropdown overlay={menu} trigger='click' open={open} onOpenChange={setOpen}>
      <button className='p_btn' onClick={e => e.preventDefault()}>
        <RiUserSettingsLine className='p_icon' />
        {!collapsed && <div className='p_side'>
          <p className='p_title'>{t('menu.profile')}</p>
          <p className='p_user'>{user?.mail?.toLowerCase()}</p>
        </div>}
      </button>
    </Dropdown>
  );
}

export function Profile1(props){
  const { collapsed, setCollapsed } = props;

  const onClick = () => setCollapsed(!collapsed);

  return (
    <div className='menu_img_container'>
      {!collapsed ? <img className='h_logo' src={header_image} alt='header_image'/> : ''}
      <button className='h_icon_btn' onClick={onClick}>
        <DynamicMDIcon name='MdOutlineMenu' className='h_icon' />
      </button>
    </div>
  );
}