import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { ButtonRowConfirm, Date, Error, ModalTitle, Overlay, Select, Time } from '../../all';

export function Add(props){
  const { visible, closeModal, selected, sites, emps } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: null });
  const [site, setSite] = useState({ value: null });
  const [date1, setDate1] = useState({ value: moment() });
  const [date2, setDate2] = useState({ value: moment() });
  const [time1, setTime1] = useState({ value: '' });
  const [time2, setTime2] = useState({ value: '' });
  const [total, setTotal] = useState(0);

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

  const onChangeTime = (start, end) => {
    console.log(start, end);
  }

  const nameProps = { value: name, setValue: setName, label: t('employee.title'), placeholder: t('time.select_emp'), 
    data: emps, setError, s_value: 'empCode', s_descr: 'empName' };
  const siteProps = { value: site, setValue: setSite, label: t('shop.title'), placeholder: t('time.select_shop'), 
    data: sites, setError, s_value: 'siteId', s_descr: 'name' };
  const disabledDate = d => !d || d.isAfter(moment().add('day', 1).format('yyyy-MM-DD'))
  const date1Props = { value: date1, setValue: setDate1, label: t('time.date1'), setError, inRow: true, disabledDate };
  const date2Props = { value: date2, setValue: setDate2, label: t('time.date2'), setError, inRow: true, disabledDate };
  const time1Props = { value: time1, setValue: setTime1, label: t('time.time1'), setError, inRow: true }
  const time2Props = { value: time2, setValue: setTime2, label: t('time.time2'), setError, inRow: true }
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
              <div className='ac_row' style={{marginTop: 20}}>
                <Date {...date1Props} />
                <div className='gap' />
                <Date {...date2Props} />
              </div>
              <div className='ac_row' style={{marginTop: 20}}>
                <Time {...time1Props} />
                <div className='gap' />
                <Time {...time2Props} />
              </div>
              <p className='m_footer'>{t('time.total')}: {total}</p>
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