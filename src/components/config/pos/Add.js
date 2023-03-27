import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { deleteRequest, getConstants, sendRequest, setSystemTypes } from '../../../services';
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm, Select } from '../../all';

export function Add(props){
  const { visible, selected, closeModal, sites, getSites } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [site, setSite] = useState({ value: null });
  const [type, setType] = useState({ value: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const types = useSelector(state => state.temp.systemTypes);
  const dispatch = useDispatch();

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
    e?.preventDefault();
    setError(null);
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && site?.value && (type?.value || type?.value === 0)){
      setLoading(true);
      let data1 = { descr: name?.value, systemType: type?.value, currentDate: moment().format('yyyy.MM.DD') };
      let data2 = selected 
        ? { siteId: site?.value, terminalId: selected?.terminalId, lastUpdate: moment().format('yyyy.MM.DD'), status: 1 }
        : { siteID: site?.value };
      let data = {...data1, ...data2};
      console.log(data);
      let api = selected ? 'Site/UpdatePos' : 'Site/AddPos';
      const response = await dispatch(sendRequest(user, token, api, data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('pos.add_success'));
      }
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!site?.value) setSite({ value: null, error: t('error.not_empty') });
      if(!type?.value && type?.value !== 0) setType({ value: null, error: t('error.not_empty') });
    }
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

  const nameProps = { value: name, setValue: setName, label: t('pos.name'), placeholder: t('pos.name1'), setError,
    length: 20 };
  const siteProps = { value: site, setValue: setSite, label: t('pos.site'), placeholder: t('pos.site1'), setError,
    data: sites, s_value: 'siteId', s_descr: 'name' };
  const typeProps = { value: type, setValue: setType, label: t('pos.type'), placeholder: t('pos.type1'), setError,
    data: types, s_value: 'valueNum', s_descr: 'valueStr1' };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStayCurrentPortrait' title={t(selected ? 'pos.edit' : 'pos.new')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input {...nameProps} />
              <Select {...siteProps} />
              <Select {...typeProps} />
              <div style={{padding: 1}} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}