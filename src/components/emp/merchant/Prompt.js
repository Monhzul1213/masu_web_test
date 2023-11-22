import React from 'react';
import ReactRouterPrompt from "react-router-prompt";
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow } from './Button';

export function Prompt1(props){
  const { value, edited } = props;
  const { t } = useTranslation();

  return (
    <ReactRouterPrompt when={value ? value : edited}>
      {({ isActive, onCancel }) =>
        isActive && (
          <Modal title={null} footer={null} closable={false} open={true} centered={true} width={360}>
            <div className='m_back'>
              <p className='m_descr'>{edited ? t('profile.error1') : t('profile.error')}</p>
            </div>
            <ButtonRow onClickCancel={onCancel} text1='profile.ok'/>
          </Modal>
        )
      }
    </ReactRouterPrompt>
  );
}

export function Prompt2(props){
  const { edited } = props;
  const { t } = useTranslation();

  return (
    <ReactRouterPrompt when={edited}>
      {({ isActive, onCancel }) =>
        isActive && (
          <Modal title={null} footer={null} closable={false} open={true} centered={true} width={360}>
            <div className='m_back'>
              <p className='m_descr'>{t('profile.error')}</p>
              <p className='m_descr'>{t('profile.error')}</p>
            </div>
            <ButtonRow onClickCancel={onCancel} text1='profile.ok'/>
          </Modal>
        )
      }
    </ReactRouterPrompt>
  );
}