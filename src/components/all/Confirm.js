import React from 'react';
import ReactRouterPrompt from "react-router-prompt";
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow } from './ButtonRow';
import { Button } from './Button';

export function Confirm(props){
  const { open, text, confirm } = props;
  const { t } = useTranslation();

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        <p className='m_title' id='m_confirm'>{t('page.confirm')}</p>
        <p className='m_descr'>{t(text)}</p>
      </div>
      <ButtonRow onClickCancel={() => confirm(false)} onClickSave={() => confirm(true)} text1='page.no' text2='page.yes' />
    </Modal>
  );
}

export function Prompt(props){
  const { edited } = props;
  const { t } = useTranslation();

  return (
    <ReactRouterPrompt when={edited}>
      {({ isActive, onConfirm, onCancel }) =>
        isActive && (
          <Modal title={null} footer={null} closable={false} open={true} centered={true} width={360}>
            <div className='m_back'>
              <p className='m_title' id='m_confirm'>{t('page.confirm')}</p>
              <p className='m_descr'>{t('page.back_confirm')}</p>
            </div>
            <ButtonRow onClickCancel={onCancel} onClickSave={onConfirm} text1='page.no' text2='page.yes' />
          </Modal>
        )
      }
    </ReactRouterPrompt>
  );
}

export function Warning(props){
  const { open, text, close } = props;
  const { t } = useTranslation();

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        <p className='m_descr'>{t(text)}</p>
      </div>
      <div className='invt_btn_row' style={{paddingBottom: 10}}>
        <Button className='invt_btn' text={t('page.ok')} onClick={close} />
      </div>
    </Modal>
  );
}