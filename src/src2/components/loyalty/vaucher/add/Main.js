import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Date, Select } from '../../../../../components/all';
import { Input, MoneyInput, ValidateInput } from '../../../../../src1/components/all/all_m';
import { getList } from '../../../../../services';

export function Main(props){
  const { setError, setEdited, name, setName, perc, setPerc, price, setPrice, qty, setQty, beginDate, setBeginDate, endDate, setEndDate,
          status, setStatus, category, setCategory, type, setType, number, setNumber, invt, setInvt, controlDisable } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);
  const [types, setTypes] = useState([{ value: 0, label: 'Хувиар хөнгөлөх' },]);
  const [categories, setCategories] = useState();
  const [invts, setInvts] = useState();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeDate1 = value => {
    setBeginDate(value);
  }

  const onChangeDate2 = value => {
    setEndDate(value);
  }

  const onChangeStatus = value => {
    setStatus(value);
  }
  const onChangeType = value => {
    setType(value);
  }

  const onFocusType = async () => {
    if(!types?.length || types?.length === 1){
      setTypes([
        { value: 0, label: 'Хувиар хөнгөлөх' },
        { value: 1, label: 'Дүнгээр хөнгөлөх' },
      ]);
    }
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { value: 1, label: 'Идэвхтэй' },
        { value: 0, label: 'Идэвхгүй' },
      ]);
    }
  }
  const getCategories = async (toGet, id) => {
    if(!categories?.length || categories?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        setCategories(response?.data);
        if(id) setCategory({ value: id });
      }
    }
  }

  const getInvts = async (toGet, id) => {
    if(!categories?.length || categories?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setError(response?.error);
      else {
        let invts = [];
        response?.data?.inventoryies?.forEach(item => {
            invts.push(item?.msInventory)})
        setInvts(invts)
        if(id) setInvt({ value: id });
      }
    }
  }

  const changeNumber = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setNumber({...value, error: 'must_number'});
    else setNumber({ value: text });
  } 

  const changePerc = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPerc({...value, error: 'must_number'});
    else setPerc({ value: text });
  }
  

  const amtProps = { value: price, setValue: setPrice, label: t('voucher.voucherAmt'), placeholder: t('voucher.voucherAmt'), setError, setEdited, disabled: controlDisable };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, length: 100, inRow: true, disabled: controlDisable };
  const date1Props = { value: beginDate, setValue: onChangeDate1, label: t('voucher.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: onChangeDate2, label: t('voucher.endDate'), inRow: true };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', s_descr: 'label', label: t('order.status'), onFocus: onFocusStatus };
  const numberProps = { value: number, setValue: changeNumber, label: t('voucher.voucherQty'), placeholder: t('voucher.voucherQty'), setEdited, setError, length: 30 };


  return (
    <div className='cou_add_back'>
      <Input {...nameProps}/>
      {/* <Select {...typeProps}/> */}
      <Input {...numberProps}/>
        {<MoneyInput {...amtProps}/>}
      {/* {(type?.value === 0) ? <ValidateInput {...percProps}/> :  <MoneyInput {...amtProps}/>} */}
      <div className='ac_row' style={{marginTop: 20}}>
        <Date {...date1Props} />
        <div className='gap' />
        <Date {...date2Props} />
      </div>
      <Select {...statProps}/>
    </div>
  );
}