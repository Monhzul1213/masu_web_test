import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';

import '../../../css/config.css'
import { Input, Error, Overlay, Select, ButtonRow, ModalTitle  } from '../../../components/all';

export function Account(props){
  const { visible, closeModal, setData } = props;
  const { t,  } = useTranslation();
  const [number, setNumber] = useState({ value: '' });
  const [status, setStatus] = useState({ value: 1 });
  const [states, setStates] = useState([{ value: 1, label: 'Хаан банк' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearForm = () => {
    setStatus({ value: 1 })
    setNumber({value: ''})
  };

  const onClickSave = async e => {
    e?.preventDefault();
    if (!number?.value) {
      setError('Дансны дугаар оруулна уу');
      return;
    }
    const newAccount = {
      number: number?.value,
      bank: status.label,
      bankId: status?.value,
    };
    console.log(status);

    setData(prev => [...(prev || []), newAccount]); 
    closeModal();
    clearForm();
  }
  

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { value: 1, label: 'Хаан банк' },
        { value: 0, label: 'Худалдаа хөгжлийн банк' },
        { value: 2, label: 'Голомт банк' },
        { value: 3, label: 'Хас банк' },
      ]);
    }
  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  const numberProps = {value: number, setValue: setNumber, label: t('account.acctCode'), placeholder: t('account.acctCode'), setError}
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: 'value', s_descr: 'label', label: t('employee.bank'), onFocus: onFocusStatus };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={closeModal} style={{marginTop: 300, marginRight: 400}} width={400}>
      <Overlay loading={loading} className='m_back2'>
        <div>
          <ModalTitle title={t('account.add')} />
          <Select {...statusProps}/>
          <Input {...numberProps}/>
        </div>
        {error && <Error error={error} id = 'm_error' />}
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}


