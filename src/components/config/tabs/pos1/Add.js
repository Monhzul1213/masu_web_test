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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setName({ value: selected?.name ?? '' });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    /*
    if(name?.value?.trim()){
      setLoading(true);
      let data = { name: name?.value?.trim(), address: address?.value?.trim(), phone: phone?.value?.trim(), descr: descr?.value?.trim() };
      if(selected) data.siteID = selected.siteId;
      else data.merchantID = user?.merchantId;
      console.log(data);
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
    */
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      /*
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.delete_success'));
      }
      setLoading(false);
      */
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('pos.name'), placeholder: t('pos.name1'), setError };
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
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}