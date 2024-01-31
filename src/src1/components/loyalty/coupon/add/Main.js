import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Date, Select } from '../../../../../components/all';
import { Input, MoneyInput, ValidateInput } from '../../../all/all_m';
import { getList } from '../../../../../services';

export function Main(props){
  const { setError, setEdited, name, setName, perc, setPerc, price, setPrice, beginDate, setBeginDate, endDate, setEndDate,
          status, setStatus, category, setCategory, type, setType, number, setNumber, invt, setInvt, selected } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);
  const [types, setTypes] = useState([{ value: 0, label: 'Хувиар хөнгөлөх' },]);
  const [categories, setCategories] = useState();
  const [invts, setInvts] = useState();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusType();
    onFocusStatus();
    getInvts();
    getCategories();
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
        { value: 1, label: 'Идэвхитэй' },
        { value: 0, label: 'Идэвхигүй' },
      ]);
    }
  }
  const getCategories = async () => {
    if(!categories?.length || categories?.length === 1 ){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        setCategories(response?.data);
      }
    }
  }

  const getInvts = async () => {
    if(!categories?.length || categories?.length === 1 ){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setError(response?.error);
      else {
        let invts = [];
        response?.data?.inventoryies?.forEach(item => {
            invts.push(item?.msInventory)})
        setInvts(invts)
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
  

  const amtProps = { value: price, setValue: setPrice, label: t('coupon.couponAmt'), placeholder: t('coupon.couponAmt'), setError, setEdited , disabled : selected ? true : false};
  const percProps = { value: perc, setValue: changePerc, label: t('discount.perc'), placeholder: t('discount.perc'), setError, setEdited, max: 100, disabled : selected ? true : false };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, length: 100, inRow: true, disabled : selected ? true : false};
  const date1Props = { value: beginDate, setValue: onChangeDate1, label: t('coupon.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: onChangeDate2, label: t('coupon.endDate'), inRow: true };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', s_descr: 'label', label: t('order.status'), onFocus: onFocusStatus };
  const typeProps = { value: type, setValue: setType, data: types, s_value: 'value', s_descr: 'label', label: t('coupon.type'), onFocus: onFocusType, disabled : selected ? true : false };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, setEdited, inRow: false, placeholder: t('coupon.category_select'),
    data: categories, s_value: 'categoryId', s_descr: 'categoryName', onFocus: getCategories, disabled : selected ? true : false };
  const numberProps = { value: number, setValue: changeNumber, label: t('inventory.t_qty'), placeholder: t('inventory.t_qty'), setEdited, setError, length: 30, };
  const invtProps = { value: invt, setValue: setInvt, label: t('coupon.invt'), setError, setEdited, inRow: false,
  data: invts, s_value: 'invtId', s_descr: 'name', onFocus: getInvts, placeholder: t('coupon.invt_select'), disabled : selected ? true : false };

  return (
    <div className='cou_add_back'>
      <Input {...nameProps}/>
      <Select {...typeProps}/>
      {(type?.value === 0) ? <ValidateInput {...percProps}/> :  <MoneyInput {...amtProps}/>}
      <div className='ac_row' style={{marginTop: 20}}>
        <Date {...date1Props} />
        <div className='gap' />
        <Date {...date2Props} />
      </div>
      <Select {...statProps}/>
      <Select {...categoryProps} />
      <Select {...invtProps} />
      <Input {...numberProps}/>
    </div>
  );
}