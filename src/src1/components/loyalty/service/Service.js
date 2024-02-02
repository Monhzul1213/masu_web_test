import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { ButtonRow, Overlay, Error, PlainSelect, IconButton, Input, ModalTitle, Empty2 } from '../../all/all_m';
import { List } from './List';
import { age } from '../coupon/add/age';

export function Service(props){
  const { visible, closeModal, setItem, setVisible, item} = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [name, setName] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState(-1);
  const [beginAge, setBeginAge] = useState(0);
  const [endAge, setEndAge] = useState(100);
  const [genders, setGenders] = useState([{ value: -1, label: 'Бүгд'}]);
  const [buyer, setBuyer] = useState('A');
  const [buyers, setBuyers] = useState([{ value: 'A', label: 'Бүгд'}]);
  const [otherBuyer, setOtherBuyer] = useState('A');
  const [otherBuyers, setOtherBuyers] = useState([{ value: 'A', label: 'Бүгд'}]);
  const [checked, setChecked] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async query => {
      setLoading(true);
      let api = 'Site/GetConsumer' + query ?? '';
      let response = await dispatch(getList(user, token, api))
      if(response?.error) setError(response?.error);
      else {
        response?.data?.forEach(list => {
          let check = item?.findIndex(it => it?.consumerId === list?.consumerId)
          if(check !== -1) list.checked = true
        })
        setData(response?.data);
        }
        setLoading(false);
        setChecked(false);
  }

  const onClickSave = () => {
    setLoading(true);
    let list = [];
    data?.forEach(li => { if(li?.checked) list.push(li)})
    if(!list?.length ) setError(t('coupon.no_data'))
    else {
      let li = []
      list?.forEach(l=> {
        let check = item?.findIndex(it => it?.consumerId === l?.consumerId)
        if(check === -1) li.push(l)
      })
      setItem(old => [...old, ...li])
      setVisible(false)
    }
    setLoading(false)
  }

  const onFocusGender = async () => {
    if(!genders?.length || genders?.length === 1){
      setGenders([
        { value: -1, label: 'Бүгд' },
        { value: 'M', label: 'Эрэгтэй' },
        { value: 'F', label: 'Эмэгтэй' },
      ]);
    }
  }

  const onFocusBuyer = async () => {
    if(!buyers?.length || buyers?.length === 1){
      setBuyers([
        { value: 'A', label: 'Бүгд' },
        { value: 'Y', label: 'Худалдан авалт хйисэн' },
        { value: 'N', label: 'Худалдан авалт хийгээгүй' },
      ]);
    }
  }

  const onFocusOtherBuyer = async () => {
    if(!otherBuyers?.length || otherBuyers?.length === 1){
      setOtherBuyers([
        { value: 'A', label: 'Бүгд' },
        { value: 'Y', label: 'Үйлчлүүлж байсан' },
        // { value: 'N', label: 'Үйлчлүүлээгүй' },
      ]);
    }
  }

  const onClick = () => {
    let query = '?Descr=' + (name?.value ? name?.value : '')
    query += beginAge || beginAge === 0 ? '&BeginAge=' + beginAge : ''
    query += endAge ? '&EndAge=' + endAge : ''
    query += gender !== -1 ? '&Gender=' + gender : ''
    query += buyer ? '&isBuyer=' + buyer : ''
    query += otherBuyer ? '&isOtherBuyer=' + otherBuyer : ''
    onSearch(query);
  }

  const className = 'cou_select', classLabel = 'cou_select_lbl', className1 = 'cou_select1', className2 = 'cou_select2';
  const maxheight= 'calc(90vh - 105px )';
  const nameProps = { value: name, setValue: setName, label: t('page.name'), setError, placeholder: t('coupon.name_phone'), inRow: true  };
  const beginAgeProps = { value: beginAge, setValue: setBeginAge, label: t('coupon.age'), setError, className: className1, classLabel, data: age };
  const endAgeProps = { value: endAge, setValue: setEndAge, label: t('coupon.age'), setError, className: className1, classLabel, data: age };
  const genderProps = { value: gender, setValue: setGender, data: genders, s_value: 'value', s_descr: 'label', label: t('coupon.gender'), onFocus: onFocusGender, className: className2 , classLabel};
  const buyerProps = { value: buyer, setValue: setBuyer, data: buyers, s_value: 'value', s_descr: 'label', label: t('coupon.buyer'), onFocus: onFocusBuyer, className , classLabel};
  const otherBuyerProps = { value: otherBuyer, setValue: setOtherBuyer, data: otherBuyers, s_value: 'value', s_descr: 'label', label: t('coupon.otherBuyer'), onFocus: onFocusOtherBuyer, className: className2, classLabel : 'cou_select_lbl1' };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave  };
  const searchProps = {text: t('page.search'), className: 'cou_add_btn', onClick}
  const listProps = {checked, setChecked, data, setData}
  const emptyProps = { icon: 'MdSupervisorAccount' };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={600}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t('coupon.consumer_add')} isMD={true} />
          <div style={{ overflowY: 'scroll', maxHeight: maxheight }}>
              <Input {...nameProps} />
              <div className='cou_row'>
                <PlainSelect {...beginAgeProps}/>
                <div className='gap'/>
                <PlainSelect {...endAgeProps}/>
                <div className='gap'/>
                <PlainSelect {...genderProps} />
              </div>
              <div className='cou_row'>
                <PlainSelect {...buyerProps} />
                <div className='gap'/>
                <PlainSelect {...otherBuyerProps} />
                <div className='gap'/>
                <IconButton {...searchProps}/>
              </div>
          </div>
          {data?.length ? <List {...listProps}/> : <Empty2 {...emptyProps}/>}
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}