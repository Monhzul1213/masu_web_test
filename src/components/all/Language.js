import React from 'react';
import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { flag_mn, flag_en, flag_kr, flag_cn } from '../../assets';
import { DynamicMDIcon } from './DynamicIcon';

export function Language(props){
  const { i18n } = useTranslation();
  const { hideArrow, id } = props;

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
          <img src={flag_kr} alt='Logo' className='menu_language_logo1'/>
          <span className='menu_language'>KR</span>
        </div>
      </Menu.Item>
      <Menu.Item key='cn' onClick={() => changeLanguage('cn')}>
        <div className='menu_language_back'>
          <img src={flag_cn} alt='Logo' className='menu_language_logo2'/>
          <span className='menu_language'>CN</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className='menu_language_btn'>
        <span className={'menu_language_link'} onClick={e => e.preventDefault()} id={id}>
          <img src={i18n?.language === 'mn' ? flag_mn : i18n?.language === 'en' ? flag_en : i18n?.language === 'cn' ? flag_cn : flag_kr} alt='Logo' className='menu_language_logo3'/>
          {i18n?.language === 'mn' ? 'МН' : (i18n?.language === 'en' ? 'EN' : i18n?.language === 'cn' ? 'CN' : 'KR')}
        </span>
        <DynamicMDIcon name='MdKeyboardArrowDown' className={hideArrow ? 'header_user_icon' : 'menu_language_arrow'} id={id + 'a'} />
      </div>
    </Dropdown>
  )
}

export function LanguageHome(props){
  const { i18n } = useTranslation();
  const { hideArrow, id } = props;

  const menuStyle = {paddingTop: 5, paddingBottom: 5, borderRadius: 5};

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
  }

  const menu = (
    <Menu style={menuStyle}>
      <Menu.Item key='en' onClick={() => changeLanguage('en')}>
        <div className='menu_language_back'>
          <img src={flag_en} alt='Logo' className='menu_language_logo' />
          <span className='menu_language'>English</span>
        </div>
      </Menu.Item>
      <Menu.Item key='mn' onClick={() => changeLanguage('mn')}>
        <div className='menu_language_back'>
          <img src={flag_mn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>Монгол</span>
        </div>
      </Menu.Item>
      <Menu.Item key='kr' onClick={() => changeLanguage('kr')}>
        <div className='menu_language_back'>
          <img src={flag_kr} alt='Logo' className='menu_language_logo1'/>
          <span className='menu_language'>한국</span>
        </div>
      </Menu.Item>
      <Menu.Item key='cn' onClick={() => changeLanguage('cn')}>
        <div className='menu_language_back'>
          <img src={flag_cn} alt='Logo' className='menu_language_logo2'/>
          <span className='menu_language'>中國</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className='menu_language_btn1'>
        <span className={hideArrow ? 'header_language_link' : 'menu_language_link'} onClick={e => e.preventDefault()} id={id}>
          <img src={i18n?.language === 'mn' ? flag_mn : i18n?.language === 'en' ? flag_en : i18n?.language === 'cn' ? flag_cn : flag_kr} alt='Logo' className='menu_language_logo3'/>
          {i18n?.language === 'mn' ? 'МН' : (i18n?.language === 'en' ? 'EN' : i18n?.language === 'cn' ? '中國' : '한국')}
        </span>
        {/* <DynamicMDIcon name='MdKeyboardArrowDown' className={hideArrow ? 'header_user_icon' : 'menu_language_arrow'} id={id + 'a'} /> */}
      </div>
    </Dropdown>
  )
}