import React from 'react';
import { Dropdown } from 'antd';
import { RiUserSettingsLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { logout, setIsLoggedIn } from '../../services';
import { Button } from '../all/Button';

export function Profile(props){
  const { collapsed } = props;
  const { t } = useTranslation();
  const { user } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onClickAccount = e => {
    e?.preventDefault();
  }

  const onClickSignout = e => {
    e?.preventDefault();
    dispatch(logout());
    dispatch(setIsLoggedIn(false));
    window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
    window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
    window.localStorage.removeItem('CREDENTIALS_FLUSH');
  }

  const menu = () => {
    return (
      <div className='p_menu'>
        <Button className='p_menu_btn' text={t('profile.account')} onClick={onClickAccount} />
        <Button className='p_menu_btn' text={t('profile.signout')} onClick={onClickSignout} />
      </div>
    );
  }
  
  return (
    <Dropdown overlay={menu}>
      <button className='p_btn' onClick={e => e.preventDefault()}>
        <RiUserSettingsLine className='p_icon' />
        {!collapsed && <div className='p_side'>
          <p className='p_title'>{t('menu.profile')}</p>
          <p className='p_user'>{user?.mail}</p>
        </div>}
      </button>
    </Dropdown>
  );
}