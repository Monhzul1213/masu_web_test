import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { DynamicTBIcon, Error, Overlay } from '../../../all';
import { MaskedInput } from './MaskedInput';
import { ButtonRow } from '../ButtonRow';

export function BankModal(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [card, setCard] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [date, setDate] = useState({ value: '' });
  const [code, setCode] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClickSave = e => {
    e?.preventDefault();
    setError(null);
    if(card?.value?.trim() && name?.value?.trim() && date?.value?.trim() && code?.value?.trim()){
      setLoading(true);
      setTimeout(() => setLoading(false), 1200);
    } else {
      if(!card?.value?.trim()) setCard({ value: '', error: t('error.not_empty') });
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!date?.value?.trim()) setDate({ value: '', error: t('error.not_empty') });
      if(!code?.value?.trim()) setCode({ value: '', error: t('error.not_empty') });
    }
  }

  const handleEnter = e => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    form.elements[index + 1].focus();
    e.preventDefault();
  }

  const cardProps = { value: card, setValue: setCard, label: t('type.bank_card'), placeholder: t('type.bank_card'),
    mask: '9999 9999 9999 9999', handleEnter, setError };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('type.bank_name'),
    handleEnter, setError };
  const dateProps = { value: date, setValue: setDate, label: t('page.date'), placeholder: t('type.bank_date'),
    mask: '99/99', handleEnter, setError };
  const codeProps = { value: code, setValue: setCode, label: t('type.bank_code'), placeholder: t('type.CVC'),
    handleEnter: onClickSave, setError };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <div className='m_title_row'>
            <DynamicTBIcon className='m_title_icon' name='TbCreditCard' />
            <p className='m_title'>{t('type.bank_m')}</p>
          </div>
          <form onSubmit={onClickSave}>
            <MaskedInput {...cardProps} />
            <MaskedInput {...nameProps} />
            <MaskedInput {...dateProps} />
            <MaskedInput {...codeProps} />
          </form>
          {error && <Error error={error} id='m_error' />}
        </div> 
        <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} type='submit' />
      </Overlay>
    </Modal>
  )
}