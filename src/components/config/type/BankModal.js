import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { Error, Overlay, ButtonRow, ModalTitle, MaskedInput } from '../../all';

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
    if(card?.value && name?.value && date?.value && code?.value?.trim()){
      setTimeout(() => setLoading(false), 1200);
    } else {
      if(!card?.value) setCard({ value: '', error: t('error.not_empty') });
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!date?.value) setDate({ value: '', error: t('error.not_empty') });
      if(!code?.value?.trim()) setCode({ value: '', error: t('error.not_empty') });
    }
  }

  const cardProps = { value: card, setValue: setCard, label: t('type.card'), placeholder: t('type.card'), mask: '9999 9999 9999 9999', setError };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('type.bank_name'), setError };
  const dateProps = { value: date, setValue: setDate, label: t('page.date'), placeholder: t('type.bank_date'), mask: '99/99', setError };
  const codeProps = { value: code, setValue: setCode, label: t('type.bank_code'), placeholder: t('type.CVC'), handleEnter: onClickSave, setError };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='TbCreditCard' title={t('type.bank_m')} />
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