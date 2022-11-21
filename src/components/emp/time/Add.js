import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRowConfirm, Error, ModalTitle, Overlay, Select } from '../../all';

export function Add(props){
  const { visible, closeModal, selected, sites, emps } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: null });
  const [site, setSite] = useState({ value: null });

  useEffect(() => {
    return () => {};
  }, []);

  const onClickSave = async e => {
    // e?.preventDefault();
    // setError(null);
    // if(checkValid()){
      // setLoading(true);
    //   let data = { name: name?.value, address: address?.value, phone: phone?.value, descr: descr?.value?.trim() };
    //   if(selected) data.siteID = selected.siteId;
    //   else data.merchantID = user?.merchantId;
    //   let api = selected ? 'Site/UpdateSite' : 'Site/AddSite';
    //   const response = await dispatch(sendRequest(user, token, api, data));
    //   if(response?.error) setError(response?.error);
    //   else {
    //     closeModal(true);
    //     message.success(t('shop.add_success'));
    //   }
    //   setLoading(false);
    // }
  }

  const onClickDelete = async () => {
    // setError(null);
    // setOpen(false);
    // if(sure){
      // setLoading(true);
    //   const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
    //   console.log(response);
    //   if(response?.error) setError(response?.error);
    //   else {
    //     closeModal(true);
    //     message.success(t('shop.delete_success'));
    //   }
    //   setLoading(false);
    // }
  }

  const nameProps = { value: name, setValue: setName, label: t('employee.title'), placeholder: t('time.select_emp'), 
    data: emps, setError, s_value: 'empCode', s_descr: 'empName' };
  const siteProps = { value: site, setValue: setSite, label: t('shop.title'), placeholder: t('time.select_shop'), 
    data: sites, setError, s_value: 'siteId', s_descr: 'name' };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete, isModal: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={440}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSchedule' title={t(selected ? 'time.edit' : 'time.add')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Select {...nameProps} />
              <Select {...siteProps} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRowConfirm {...btnProps} />
      </Overlay>
    </Modal>
  )
}

/**
        <div className='m_back'>
          
        </div>
 */

 /**

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteRequest, sendRequest } from '../../../../services';
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm } from '../../../all';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: '' });
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

  const checkValid = () => {
    let nameLength = 2, addressLength = 8, phoneLength = 8;
    let isNameValid = name?.value && name?.value?.length >= nameLength;
    let isAddressValid = !address?.value || address?.value?.length >= addressLength;
    let isPhoneValid = !phone?.value || phone?.value?.length >= phoneLength;
    if(isNameValid && isAddressValid && isPhoneValid){
      return true;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!isAddressValid) setAddress({ value: address?.value, error: ' ' + addressLength + t('error.longer_than') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      return false;
    }
  }

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
*/