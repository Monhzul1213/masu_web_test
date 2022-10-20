import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { DynamicTBIcon } from '../../../all';
import { MaskedInput } from './MaskedInput';

export function BankModal(props){
  const { visible } = props;
  const { t } = useTranslation();
  const [card, setCard] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [date, setDate] = useState({ value: '' });
  const [code, setCode] = useState({ value: '' });

  const cardProps = { value: card, setValue: setCard, label: t('type.bank_card'), placeholder: t('type.bank_card'), mask: '9999 9999 9999 9999' };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('type.bank_name') };
  const dateProps = { value: date, setValue: setDate, label: t('page.date'), placeholder: t('type.bank_date'), mask: '99/99' };
  const codeProps = { value: code, setValue: setCode, label: t('type.bank_code'), placeholder: t('type.CVC') };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <div className='m_title_row'>
        <DynamicTBIcon className='m_title_icon' name='TbCreditCard' />
        <p className='m_title'>{t('type.bank_m')}</p>
      </div>
      <MaskedInput {...cardProps} />
      <MaskedInput {...nameProps} />
      <MaskedInput {...dateProps} />
      <MaskedInput {...codeProps} />
    </Modal>
  )
}