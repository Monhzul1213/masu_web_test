import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import { Button, DynamicFAIcon } from '../all';
import { useSelector } from 'react-redux';

const Download = props => {
  const { icon, text2, onClick } = props;

  return (
    <button className='ap_btn' onClick={() => onClick(text2)}>
      <DynamicFAIcon className='ap_icon' name={icon} />
      <div className='ap_side'>
        {/* <p className='ap_btn_text'>{text1}</p> */}
        <p className='ap_btn_text2'>{text2}</p>
      </div>
    </button>
  )
}

export function AppModal(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const { user }  = useSelector(state => state.login);

  const onClick = type => {
    let url = '';
    if(type === 'Windows') url = "https://app.masu.mn/files/MasuInstaller.exe";
    else if(type === 'Play Store') url = "https://play.google.com/store/apps/details?id=com.masupos";
    else if(type === 'App Store') url = "https://apps.apple.com/mn/app/masupos/id1671694304";
    window.open(url);
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={520}>
      <div className='m_back'>
        <p className='ap_title'>{t('config.thanks')}</p>
        <div className='app_scroll'>
          <p className='ap_text'>{t('config.watch_video')}</p>
          <LiteYouTubeEmbed id={user?.msMerchant?.merchantType === 1 ? "N0VcE6v3qcQ" : "F4fHbjsSZxc"} title="What’s new in Material Design for the web (Chrome Dev Summit 2019)" />
          <div style={{padding: 5}} />
          <p className='ap_text'>{t('config.install')}</p>
          <div className='ap_row'>
            <Download icon='FaWindows' text1={t('config.down_window')} text2='Windows' onClick={onClick} />
            <Download icon='FaGooglePlay' text1={t('config.down_ios')} text2='Play Store' onClick={onClick} />
            <Download icon='FaApple' text1={t('config.down_android')} text2='App Store' onClick={onClick} />
          </div>
          <div className='ap_row'>
          </div>
          {/* <div style={{padding: 5}} /> */}
          {/* <p className='ap_text'>{t('config.go_to')}</p> */}
        </div>
        <Button className='l_btn' text={t('config.next_btn')} onClick={closeModal} />
      </div>
    </Modal>
  );
}