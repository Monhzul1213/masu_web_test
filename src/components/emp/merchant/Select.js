import React, { useState, useEffect } from 'react';
import { Radio, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { AddInput } from './AddInput';

const { Option } = Select;

const SubSelect = props => {
  const { value, setValue, data, onFocus, handleEnter, addItem, setAddItem } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    return (<Option key={index} value={item['valueNum']} label={item['valueStr1']}>{item['valueStr1']}</Option>);
  }

  return (
    <div className='pro_back'>
      <Select
        className='pro_select'
        onChange={setValue}
        value={value}
        placeholder={t('profile.activity')}
        onFocus={() => onFocus && onFocus()}
        // dropdownRender={dropdownRender}
        >
        {data?.map(renderItem)}
      </Select>
      {value === 204 && <AddInput
        setValue={setAddItem}
        value={addItem}
        placeholder={'Нэмж бүртгүүлэх'}
        onFocus={() => onFocus && onFocus()}
        handleEnter={handleEnter}
        // dropdownRender={dropdownRender}
        >
        {data?.map(renderItem)}
      </AddInput>}
    </div>
  )
}

export function RadioSelect(props){
  const {label, value, setValue, data, data1, onFocusSales, onFocusVendor, addItem, setAddItem, merchant, setData, setData1 } = props;
  const [custom, setCustom] = useState('1');
  const { t } = useTranslation();

  useEffect(() => {
    onFocusSales()
    onFocusVendor()
    setChange()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = e => {
    setCustom(e?.target?.value);
    data?.map(item => {
      let f = item?.valueNum?.toString()
      f?.startsWith(1) ? setValue(null) : setValue()
    })
    data1?.map(item => {
      let f = item?.valueNum?.toString()
      f?.startsWith(2) ? setValue(null) : setValue()
    })
  }

  const setChange = item => {
    let string = item === undefined ? merchant?.merchantSubType : item 
    let s = string?.toString()
    if(s?.startsWith(1) || item === 204 ){
      setCustom('1')
      setValue(string)
    } else {
      setCustom('2')
      setValue(string);
    }
    
  }

  const onOpenChange = show => {
    if(!show) setChange();
  }
  const handleEnter = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = data?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      console.log(valueStr1)
      if(exists === -1){
        // let item = { valueStr1 };
        // setData(old => [...old, item]);
        setAddItem({ value: valueStr1 });
        message.success(t('login.success'))
        // setEdited && setdited(true);
      } else setAddItem({ value: addItem?.value?.trim(), error: t('inventory.variant_error') });
    }
  }
  const handleEnter1 = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = data?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      console.log(valueStr1) 
      if(exists === -1){
        // let item = { valueStr1 };
        // setData1(old => [...old, item]);
        setAddItem({ value: '' });
        // setEdited && setEdited(true);
      } else setAddItem({ value: addItem?.value?.trim(), error: t('inventory.variant_error') });
    }
  }

  let sub1Props = { value: value, setValue: setChange, label: t('profile.sale'), data: data, onFocus: onFocusSales, addItem, setAddItem, handleEnter };
  let sub2Props = { value: value, setValue: setChange, label: t('profile.vendor'), data: data1, onFocus: onFocusVendor, addItem, setAddItem };

  return (
    <div className='select_back' >
      <p className='select_lbl' >{label}</p>
      <div className='pro_dropdown'>
        <Radio.Group className='mr_radio' onChange={onChange} value={custom}>
          {/* <div> */}
            <Radio value={'1'}>{t('profile.sale')}</Radio>
            {custom === '1' && <div className='mr_times'>
              <SubSelect {...sub1Props}/>
            </div>} 
          {/* </div> */}
          {/* <div> */}
            <Radio value={'2'}>{t('profile.vendor')}</Radio>
            {custom === '2' && <div className='mr_times'>
              <SubSelect {...sub2Props}/>
            </div>}
          {/* </div> */}
        </Radio.Group>
      </div>
    </div>
  )
}