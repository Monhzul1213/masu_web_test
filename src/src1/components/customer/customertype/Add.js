import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { ButtonRow, ModalTitle, Overlay, Error } from '../../all/all_m';
import { getList, sendRequest } from '../../../../services';
import { TypeList } from './TypeList';
import { Input, Select } from '../../../../components/all';
import { TypeCustomer } from './TypeCustomer';

export function Add(props){
  const { visible, selected, closeModal, setEdited, typeId, onSearch} = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [typeName, setTypeName] = useState({ value: '' });
  const [search, setSearch] = useState({ value: null });
  const [status, setStatus] = useState({ value: 1 });
  const [dItems, setDItems] = useState([]);
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);
  const [tab, setTab] = useState(-1);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const Tab = props => {
    const { label, index } = props;
    const id = index === tab ? 'cust_btn_active' : 'cust_btn_inactive';

    return (
      <div className='customer_card_btn' id={id} onClick={() => setTab(index)}>
          {t( label)}
      </div>
    );
  }

  useEffect(() => {
    if(visible){
      onFocusStatus();
      getData(selected?.customerTypeID)
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if(selected){
      setTypeName({ value: selected?.typeName ?? '' });
      setStatus({ value: selected?.status ?? '' });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { value: 1, label: 'Идэвхитэй' },
        { value: 0, label: 'Идэвхигүй' },
      ]);
    }
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

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  const listProps = {data, setEdited, setError, setData}
  const custProps = {data: detail, setEdited, setError, setData: setDetail, search, setSearch, setDItems}
  const nameProps = {value: typeName, setValue: setTypeName, label: t('customer.type'), placeholder: t('customer.type'), setError, inRow: true}
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: 'value', s_descr: 'label', label: t('order.status'), onFocus: onFocusStatus, inRow: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={1000}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t('customer.customer_type')} isMD={true} />
          <div className='ad_row'>
            <Input {...nameProps}/>
            <div className='gap'/>
            <Select {...statusProps}/>
          </div>
          <div className='customer_tab_back'>
            <Tab label='Бараа' index = {-1}/>
            <Tab label='Харилцагч' index ={ 1}/>
          </div>
          {tab === -1 ? <TypeList {...listProps}/> :
          <TypeCustomer {...custProps}/>}
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}