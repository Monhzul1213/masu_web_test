import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { posTypes } from '../../../../helpers';
import { deleteRequest, sendRequest } from '../../../../services';
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm, Select } from '../../../all';

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
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setName({ value: selected?.name ?? '' });
      setSite({ value: selected?.siteID ?? '' });
      setType({ value: selected?.type ?? '' });
    }
    if(!sites?.length) getSites();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim() && site?.value && type?.value){
      setLoading(true);
      let data = { name: name?.value?.trim(), site: site?.value, type: type?.value };
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
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!site?.value) setSite({ value: null, error: t('error.not_empty') });
      if(!type?.value) setType({ value: null, error: t('error.not_empty') });
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Site/DeletePos/' + selected?.posId));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('pos.delete_success'));
      }
      setLoading(false);
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('pos.name'), placeholder: t('pos.name1'), setError };
  const siteProps = { value: site, setValue: setSite, label: t('pos.site'), placeholder: t('pos.site1'), setError,
    data: sites, s_value: 'siteId', s_descr: 'name' };
  const typeProps = { value: type, setValue: setType, label: t('pos.type'), placeholder: t('pos.type1'), setError,
    data: posTypes };
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