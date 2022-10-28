import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { deleteRequest, sendRequest } from '../../../../services';
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm } from '../../../all';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setName({ value: selected?.name ?? '' });
      setAddress({ value: selected?.address ?? '' });
      setPhone({ value: selected?.phone ?? '' });
      setDescr({ value: selected?.descr ?? '' });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim()){
      setLoading(true);
      let data = { merchantID: user?.merchantId, name: name?.value?.trim(), address: address?.value?.trim(), phone: phone?.value?.trim(),
        descr: descr?.value?.trim() };
      let api = selected ? 'Site/UpdateSite' : 'Site/AddSite';
      const response = await dispatch(sendRequest(user, token, api, data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.add_success'));
      }
      setLoading(false);
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.delete_success'));
      }
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('shop.name'), placeholder: t('shop.name1'), setError };
  const addrProps = { value: address, setValue: setAddress, label: t('shop.addr'), placeholder: t('shop.addr1'), setError };
  const phoneProps = { value: phone, setValue: setPhone, label: t('shop.phone'), placeholder: t('shop.phone1'), setError };
  const descrProps = { value: descr, setValue: setDescr, label: t('shop.descr'), placeholder: t('shop.descr1'), setError, handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.new')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input {...nameProps} />
              <Input {...addrProps} />
              <Input {...phoneProps} />
              <Input {...descrProps} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}