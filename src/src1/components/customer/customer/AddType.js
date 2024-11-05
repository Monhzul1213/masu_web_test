import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../../../css/config.css'
import { Input, Error, Overlay, Select, ButtonRow, ModalTitle  } from '../../../../components/all';
import { sendRequest } from '../../../../services';

export function AddType(props){
  const { visible, closeModal } = props;
  const { t,  } = useTranslation();
  const [typeName, setTypeName] = useState({ value: '' });
  const [status, setStatus] = useState({ value: 1 });
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const validateData = () => {
    if( typeName?.value?.trim() ){
      let data = {customerTypeId: 0, typeName: typeName?.value, status : status?.value, rowStatus: 'I'}
      return data;
    } else {
      if(!typeName?.value?.trim()) setTypeName({ value: '', error: t('error.not_empty') });
    }
  }
  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(validateData())
    {
      setLoading(true);
      let data = {customerTypeId: 0, typeName: typeName?.value, status : status?.value, rowStatus: 'I'}
      const response = await dispatch(sendRequest(user, token, 'Site/ModCustomerType', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true, response?.data?.customerTypeId);
        message.success(t('customer.add_success'));
        // onSearch(filter)
      }
    } 
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { value: 1, label: 'Идэвхитэй' },
        { value: 0, label: 'Идэвхигүй' },
      ]);
    }
  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  const typeProps = {value: typeName, setValue: setTypeName, label: t('discount.type'), placeholder: t('discount.type'), setError}
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: 'value', s_descr: 'label', label: t('order.status'), onFocus: onFocusStatus };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={420}>
      <Overlay loading={loading} className='m_back2'>
        <div>
        <ModalTitle title={t('customer.type')} />
          <Input {...typeProps}/>
          <Select {...statusProps}/>
        </div>
        {error && <Error error={error} id = 'm_error' />}
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}


