import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { Button, DynamicFAIcon } from '../all';

const Download = props => {
  const { icon, text1, text2, onClick } = props;

  return (
    <button className='ap_btn' onClick={() => onClick(text2)}>
      <DynamicFAIcon className='ap_icon' name={icon} />
      <div className='ap_side'>
        <p className='ap_btn_text'>{text1}</p>
        <p className='ap_btn_text2'>{text2}</p>
      </div>
    </button>
  )
}

export function AppModal(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();

  const onClick = type => {
    console.log(type);
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <div className='m_back'>
        <p className='ap_title'>{t('config.thanks')}</p>
        <p className='ap_text'>{t('config.download')}</p>
        <div className='ap_row'>
          <Download icon='FaWindows' text1={t('config.down_window')} text2='Windows Store' onClick={onClick} />
          <Download icon='FaGooglePlay' text1={t('config.down_ios')} text2='App Store' onClick={onClick} />
        </div>
        <div className='ap_row'>
          <Download icon='FaApple' text1={t('config.down_android')} text2='Google Play' onClick={onClick} />
        </div>
        <div style={{padding: 5}} />
        <p className='ap_text'>{t('config.go_to')}</p>
        <Button className='l_btn' text={t('config.go_btn')} onClick={closeModal} />
      </div>
    </Modal>
  );
}