import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { payTypes } from '../../../../helpers/dummyData';
import { Error, Overlay, ButtonRow, ModalTitle, Select, Input } from '../../../all';

export function PayModal(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [type, setType] = useState({ value: null });
  const [name, setName] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClickSave = e => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
    // if(card?.value?.trim() && name?.value?.trim() && date?.value?.trim() && code?.value?.trim()){
    //   setLoading(true);
    //   setTimeout(() => setLoading(false), 1200);
    // } else {
    //   if(!card?.value?.trim()) setCard({ value: '', error: t('error.not_empty') });
    //   if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
    //   if(!date?.value?.trim()) setDate({ value: '', error: t('error.not_empty') });
    //   if(!code?.value?.trim()) setCode({ value: '', error: t('error.not_empty') });
    // }
  }

  /**
    "pay_shop1": "Дэлгүүрүүд",
    "pay_shop2": "Бүх дэлгүүр сонгогдсон байна"
   */

  const typeProps = { value: type, setValue: setType, label: t('cashier.pay_type1'), placeholder: t('cashier.pay_type2'),
    data: payTypes, setError };
  const nameProps = { value: name, setValue: setName, label: t('cashier.pay_name1'), placeholder: t('cashier.pay_name2'), setError };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='TbCreditCard' title={t('cashier.pay_m')} />
          <Select {...typeProps} />
          <Input {...nameProps} />
          {error && <Error error={error} id='m_error' />}
        </div> 
        <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} />
      </Overlay>
    </Modal>
  )
}