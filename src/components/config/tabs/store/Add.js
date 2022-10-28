import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { ButtonRow, ModalTitle, Overlay, Input, Error } from '../../../all';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);

  const onClickSave = e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim()){
      let data = { merchantID: user?.merchantId, name: name?.value?.trim(), address: address?.value?.trim(), phone: phone?.value?.trim(),
        descr: descr?.value?.trim() };
      console.log(data);
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
    }
  }

  const onClickDelete = () => {

  }

  const nameProps = { value: name, setValue: setName, label: t('shop.name'), placeholder: t('shop.name1'), setError };
  const addrProps = { value: address, setValue: setAddress, label: t('shop.addr'), placeholder: t('shop.addr1'), setError };
  const phoneProps = { value: phone, setValue: setPhone, label: t('shop.phone'), placeholder: t('shop.phone1'), setError };
  const descrProps = { value: descr, setValue: setDescr, label: t('shop.descr'), placeholder: t('shop.descr1'), setError, handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.new')} isMD={true} />
          <form onSubmit={onClickSave}>
            <Input {...nameProps} />
            <Input {...addrProps} />
            <Input {...phoneProps} />
            <Input {...descrProps} />
          </form>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}