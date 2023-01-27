import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { sendRequest } from '../../../services';
import { ButtonRowConfirm, Error, ModalTitle, Overlay, Select } from '../../all';
import { Field } from './Field';

export function Add(props){
  const { visible, selected, closeModal, types, fields } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null);
  const [dtl, setDtl] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onClickCancel = () => closeModal();

  const validateData = () => {
    let isTypeValid = type?.value || type?.value === 0;
    let notValid = false;
    if(isTypeValid){
      let dtl2 = dtl?.map(item => {
        if(item?.fieldValue){
          if(item?.fieldType == 'N') item.fieldValue = parseFloat(item.fieldValue);
          item.rowStatus = selected ? 'U': 'I';
        } else {
          notValid = true;
          item.error = t('error.not_empty');
        }
        return item;
      });
      setDtl(dtl2);
      if(notValid) return false;
      let paymentType = types?.filter(item => item.paymentTypeId === type?.value)[0];
      let data = {
        paymentTypeID: paymentType?.paymentTypeId,
        paymentTypeName: paymentType?.paymentTypeName,
        paymentTypeDtls: dtl,
        rowStatus: selected ? 'U': 'I'
      };
      return data;
    } else {
      if(!isTypeValid) setType({ value: null, error: t('error.not_empty') });
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    const data = validateData();
    if(data){
      setError(null);
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Txn/ModPaymenType', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('cashier.add_success'));
      }
    }
  }

  const onClickDelete = async () => {

  }

  const changeType = value => {
    setType(value);
    if(value?.value){
      let dtl = [];
      fields?.forEach(item => {
        if(item.paymentTypeId === value?.value) dtl.push({...item, fieldValue: ''});
      });
      setDtl(dtl);
    }
  }

  const onChange = (fieldValue, row) => {
    setDtl(old => old.map((item, index) => {
      if(row === index) return {...old[index], fieldValue, error: null };
      return item;
    }));
  }

  const renderField = (item, index) => {
    const itemProps = { key: index, index, item, onChange };
    return (<Field {...itemProps} />);
  }

  const typeProps = { value: type, setValue: changeType, label: t('cashier.pay_m'), placeholder: t('cashier.pay_m'),
    setError, data: types, s_value: 'paymentTypeId', s_descr: 'paymentTypeName' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, show: selected ? true : false, isModal: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {/* {open && <Confirm {...confirmProps} />} */}
      <Overlay loading={loading}>
      <div className='m_back'>
        <ModalTitle icon='TbCreditCard' title={t('cashier.pay_m')} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Select {...typeProps} />
              {dtl?.map(renderField)}
              <div style={{padding: 1}} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRowConfirm {...btnProps} />
      </Overlay>
    </Modal>
  );
}
/*
export function Add(props){
  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    if(!sites?.length) await getSites();
    if(!types?.length){
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'psTerminal_SystemType', setSystemTypes));
      if(response?.error) setError(response?.error);
      setLoading(false);
    }
    if(selected){
      setName({ value: selected?.descr ?? '' });
      setSite({ value: selected?.siteId ?? '' });
      setType({ value: selected?.systemType ?? '' });
    }
  }

  const onClickSave = async e => {
    
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      let data = [{ siteId: selected?.siteId, terminalId: selected?.terminalId }];
      const response = await dispatch(deleteRequest(user, token, 'Site/DeletePos', data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('pos.delete_success'));
      }
      setLoading(false);
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('pos.name'), placeholder: t('pos.name1'), setError, length: 40 };
  const siteProps = { value: site, setValue: setSite, label: t('pos.site'), placeholder: t('pos.site1'), setError,
    data: sites, s_value: 'siteId', s_descr: 'name' };
  
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };

  
}

import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { payTypes, payShops } from '../../../helpers/dummyData';
import { Error, Overlay, ButtonRow, ModalTitle, Select, Input } from '../../all';

export function Add(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [type, setType] = useState({ value: null });
  const [name, setName] = useState({ value: '' });
  const [shop, setShop] = useState({ value: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClickSave = e => {
    e?.preventDefault();
    setError(null);
    if(type?.value && name?.value && shop?.value?.length){
      // setLoading(true);
      setTimeout(() => setLoading(false), 1200);
    } else {
      if(!type?.value) setType({ value: null, error: t('error.not_empty') });
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!shop?.value?.length) setShop({ value: [], error: t('error.not_empty') });
    }
  }

  const typeProps = { value: type, setValue: setType, label: t('cashier.pay_type1'), placeholder: t('cashier.pay_type2'),
    data: payTypes, setError };
  const nameProps = { value: name, setValue: setName, label: t('cashier.pay_name1'), placeholder: t('cashier.pay_name2'), setError };
  const shopProps = { value: shop, setValue: setShop, label: t('cashier.pay_shop1'), placeholder: t('cashier.pay_shop2'),
    data: payShops, setError, mode: 'multiple' };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <Select {...typeProps} />
          <Input {...nameProps} />
          <Select {...shopProps} />
          {error && <Error error={error} id='m_error' />}
        </div> 
        <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} />
      </Overlay>
    </Modal>
  )
}
*/