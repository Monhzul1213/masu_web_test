import React from 'react';
import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { flag_mn, flag_en, flag_kr, flag_cn } from '../../assets';
import { DynamicMDIcon } from './DynamicIcon';

export function Language(props){
  const { i18n } = useTranslation();
  const { id } = props;

  const menuStyle = {paddingTop: 5, paddingBottom: 5, borderRadius: 5};

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
  }

  const menu = (
    <Menu style={menuStyle}>
      <Menu.Item key='en' onClick={() => changeLanguage('en')}>
        <div className='menu_language_back'>
          <img src={flag_en} alt='Logo' className='menu_language_logo' />
          <span className='menu_language'>EN</span>
        </div>
      </Menu.Item>
      <Menu.Item key='mn' onClick={() => changeLanguage('mn')}>
        <div className='menu_language_back'>
          <img src={flag_mn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>МN</span>
        </div>
      </Menu.Item>
      <Menu.Item key='kr' onClick={() => changeLanguage('kr')}>
        <div className='menu_language_back'>
          <img src={flag_kr} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>KR</span>
        </div>
      </Menu.Item>
      <Menu.Item key='cn' onClick={() => changeLanguage('cn')}>
        <div className='menu_language_back'>
          <img src={flag_cn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>CN</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className='language_back'>
        <div className='menu_language_btn'>
          <span className={'menu_language_link'} onClick={e => e.preventDefault()} id={id}>
            <img src={i18n?.language === 'mn' ? flag_mn : i18n?.language === 'en' ? flag_en : i18n?.language === 'cn' ? flag_cn : flag_kr} alt='Logo' className='menu_language_logo'/>
            {i18n?.language === 'mn' ? 'MN' : (i18n?.language === 'en' ? 'EN' : i18n?.language === 'cn' ? 'CN' : 'KR')}
          </span>
        </div>
        <DynamicMDIcon name='MdKeyboardArrowDown' size={20} className='down_icon_back1' />
      </div>
    </Dropdown>
  )
}

export function LanguageLogin(props){
  const { i18n } = useTranslation();
  const { id } = props;

  const menuStyle = {paddingTop: 5, paddingBottom: 5, borderRadius: 5};

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
  }

  const menu = (
    <Menu style={menuStyle}>
      <Menu.Item key='en' onClick={() => changeLanguage('en')}>
        <div className='menu_language_back'>
          <img src={flag_en} alt='Logo' className='menu_language_logo' />
          <span className='menu_language'>EN</span>
        </div>
      </Menu.Item>
      <Menu.Item key='mn' onClick={() => changeLanguage('mn')}>
        <div className='menu_language_back'>
          <img src={flag_mn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>МN</span>
        </div>
      </Menu.Item>
      <Menu.Item key='kr' onClick={() => changeLanguage('kr')}>
        <div className='menu_language_back'>
          <img src={flag_kr} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>KR</span>
        </div>
      </Menu.Item>
      <Menu.Item key='cn' onClick={() => changeLanguage('cn')}>
        <div className='menu_language_back'>
          <img src={flag_cn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>CN</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      {/* <div className='language_back'> */}
        <div className='menu_language_btn'>
          <span className={'menu_language_link'} onClick={e => e.preventDefault()} id={id}>
            <img src={i18n?.language === 'mn' ? flag_mn : i18n?.language === 'en' ? flag_en : i18n?.language === 'cn' ? flag_cn : flag_kr} alt='Logo' className='menu_language_logo'/>
            {i18n?.language === 'mn' ? 'MN' : (i18n?.language === 'en' ? 'EN' : i18n?.language === 'cn' ? 'CN' : 'KR')}
          </span>
          <DynamicMDIcon name='MdKeyboardArrowDown' size={20} className='down_icon_back2' />
        </div>
      {/* </div> */}
    </Dropdown>
  )
}