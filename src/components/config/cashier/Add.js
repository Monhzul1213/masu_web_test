import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { sendRequest } from '../../../services';
import { ButtonRowConfirm, CheckBox, Error, ModalTitle, Overlay, Select } from '../../all';
import { Field } from './Field';

export function Add(props){
  const { visible, selected, closeModal, types, fields, selects } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [dtl, setDtl] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setTypeData([{ paymentTypeName: selected?.paymentTypeName, paymentTypeId: selected?.paymentTypeId, detailType: selected?.detailType }]);
      setType({ value: selected?.paymentTypeId });
      selected?.paymentTypeDtl?.forEach(item => {
        if(item.fieldType === 'S')
          item.selectData = selected?.paymentTypeDtlSelect?.filter(sel => sel.fieldName === item.fieldName);
      });
      setDtl(selected?.paymentTypeDtl);
      setIsActive(selected?.status === 1);
    } else
      setTypeData(types);
    // getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickCancel = () => closeModal();

  const validateData = () => {
    let isTypeValid = type?.value || type?.value === 0;
    let notValid = false;
    if(isTypeValid){
      let dtl2 = dtl?.map(item => {
        if(item?.fieldValue){
          if(item?.fieldType === 'N') item.fieldValue = parseFloat(item.fieldValue);
          return {...item,
            paymentTypeID: type?.value,
            fieldName: item?.fieldName,
            fieldValue: item?.fieldValue,
            rowStatus: selected ? 'U': 'I'
          };
        } else {
          notValid = true;
          item.error = t('error.not_empty');
          return item;
        }
      });
      setDtl(dtl2);
      if(notValid) return false;
      let paymentType = typeData?.filter(item => item.paymentTypeId === type?.value)[0];
      let data = {
        paymentTypeID: paymentType?.paymentTypeId,
        paymentTypeName: paymentType?.paymentTypeName,
        detailType: paymentType?.detailType,
        paymentTypeDtls: dtl2,
        rowStatus: selected ? 'U': 'I',
        status: isActive ? 1 : 0
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
      const response = await dispatch(sendRequest(user, token, 'Txn/ModPaymenType', [data]));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('cashier.add_success'));
      }
    }
  }

  const onClickDelete = async () => {
    setLoading(true);
    let data = {
      paymentTypeID: selected?.paymentTypeId, paymentTypeName: selected?.paymentTypeName, detailType: selected?.detailType,
      paymentTypeDtls: [], rowStatus: 'D', status: 0
    };
    const response = await dispatch(sendRequest(user, token, 'Txn/ModPaymenType', [data]));
    if(response?.error) setError(response?.error);
    else {
      closeModal(true);
      message.success(t('cashier.delete_success'));
    }
    setLoading(false);
  }

  const changeType = value => {
    setType(value);
    if(value?.value){
      let dtl = [];
      fields?.forEach(item => {
        if(item.paymentTypeId === value?.value){
          if(item?.fieldType === 'S'){
            let selectData = selects?.filter(sl => sl.paymentTypeId === item.paymentTypeId && sl.fieldName === item?.fieldName);
            dtl.push({...item, selectData, fieldValue: null});
          } else
            dtl.push({...item, fieldValue: ''});
        }
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

  const disabled = selected ? true : false;
  const typeProps = { value: type, setValue: changeType, label: t('cashier.pay_m'), placeholder: t('cashier.pay_m'),
    setError, data: typeData, s_value: 'paymentTypeId', s_descr: 'paymentTypeName', disabled };
  const statusProps = { label: t('cashier.status'), checked: isActive, setChecked: setIsActive }
  const btnProps = { onClickCancel, onClickSave, onClickDelete, show: selected ? true : false, isModal: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
      <div className='m_back'>
        <ModalTitle icon='TbCreditCard' title={t('cashier.pay_m')} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Select {...typeProps} />
              {dtl?.map(renderField)}
              <div style={{padding: 1}} />
              <CheckBox {...statusProps} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRowConfirm {...btnProps} />
      </Overlay>
    </Modal>
  );
}