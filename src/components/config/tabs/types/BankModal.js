import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { DynamicTBIcon } from '../../../all';

export function BankModal(props){
  const { visible } = props;
  const { t } = useTranslation();

  return (
    <Modal title={null} footer={null} closable={false} visible={visible} centered={true}>
      <div className='m_title_row'>
        <DynamicTBIcon className='m_title_icon' name='TbCreditCard' />
        <p className='m_title'>{t('type.bank_m')}</p>
      </div>
    </Modal>
  )
}