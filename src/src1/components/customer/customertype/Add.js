import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { ButtonRow, ModalTitle, Overlay, Error, PlainSelect } from '../../all/all_m';
import { getList, sendRequest } from '../../../../services';
import { TypeList } from './TypeList';
import moment from 'moment';

export function Add(props){
  const { visible, selected, closeModal, setEdited, typeId, onSearch, setTypeId} = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [custdata, setCustData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible){
      onFocusType();
      getData(selected?.customerTypeID)
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onFocusType = async () => {
    setError(null);
    setLoading(true);
    let api = 'Site/GetCustomerType';
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      setCustData(response?.data?.msCustomerType)
    }
    setLoading(false);
  }

  const getData = async (customerTypeID) => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetCustomerTypePrice?CustomerTypeId=' + customerTypeID));
    if(response?.error) setError(response?.error);
    else {
      response?.data.forEach(item=> {
        item.price = item?.price ? item?.price : item?.standardPrice
        if(item.useSalesPrice === 'Y'){
          let salesLabel = moment(item.salesBeginDate).format('MM.DD')
            + '-' + moment(item.salesEndDate).format('MM.DD');
          if(item.salesTimeLimited === 'Y') salesLabel += ' ' + item.salesBeginTime?.slice(0, 5) + '-' + item.salesEndTime?.slice(0, 5);
          item.salesLabel = ' (' + salesLabel + ')';
        }
      })
      setData(response?.data)
    }
    setLoading(false);
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    // if(checkValid()){
    let sendData = []
      setLoading(true);
      data?.forEach(item => {
          sendData.push({...item, merchantId : user?.merchantId, customerTypeID: typeId?.value, status: 1})
      })
      const response = await dispatch(sendRequest(user, token, 'Site/ModCustomerTypePrice',  sendData));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('customer.add_success'));
        onSearch()
      }
    // } 
  }

  const onChangeType = (value) => {
    setTypeId(value);
    getData(value)
  };
  const bStyle = { width: 250 };
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  const listProps = {data, setEdited, setError, setData}
  const typeProps = { value: typeId, setValue: onChangeType, data: custdata, s_value: 'customerTypeID', s_descr: 'typeName', label: t('customer.type'),
  classBack, classLabel, className, bStyle, onFocus: onFocusType};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={1000}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t('customer.customer_type')} isMD={true} />
          <PlainSelect {...typeProps}/>
          <TypeList {...listProps}/>
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}