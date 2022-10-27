import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow } from './ButtonRow';

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