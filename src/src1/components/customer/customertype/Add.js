import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { ButtonRow, ModalTitle, Overlay, Error } from '../../all/all_m';
import { getList, sendRequest } from '../../../../services';
import { TypeList } from './TypeList';
import moment from 'moment';

export function Add(props){
  const { visible, selected, closeModal, setEdited, typeName, onSearch} = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible){
      getData()
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetCustomerTypePrice?CustomerTypeId=' + selected?.customerTypeID));
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
          sendData.push({...item, merchantId : user?.merchantId, customerTypeID: selected?.customerTypeID, status: 1})
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

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  // const inputProps = {value: typeName, setValue: setTypeName, label: t('customer.type'), disabled: true, setEdited, setError, width:300}
  const listProps = {data, setEdited, setError, setData}

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={1500}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t('customer.customer_type')} isMD={true} />
          {/* <Input {...inputProps}/> */}
          <div className='cust_row'>
            <p className='cust_text'>{t('customer.type')}: </p>
            <div className='gap'/>
            <p className='cust_text1'>{typeName?.value}</p>
          </div>
          <TypeList {...listProps}/>
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}