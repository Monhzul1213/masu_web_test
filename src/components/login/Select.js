import React, { useState, useEffect } from 'react';
import { Radio, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { AddInput } from '../emp/merchant';

const { Option } = Select;

const SubSelect = props => {
  const { value, setValue, data, onFocus, className, classSelect } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    return (<Option key={index} value={item['valueNum']} label={item['valueStr1']}>{item['valueStr1']}</Option>);
  }

  return (
    <div className={className ?? 'radio_select_back_z'}>
      <Select
        className={classSelect ?? 'select_login'}
        onChange={setValue}
        value={value?.value}
        placeholder={t('profile.activity1')}
        onFocus={() => onFocus && onFocus()}>
        {data?.map(renderItem)}
      </Select>
    </div>
  )
}

export function RadioSelect(props){
  const {label, value, setValue, data, data1, onFocusSales, onFocusVendor, addItem, setAddItem, merchant, allData, setEdited } = props;
  const [custom, setCustom] = useState('0');
  const { t } = useTranslation();

  useEffect(() => {
    let s = merchant?.merchantSubType?.toString()
    if(s?.startsWith(1) || merchant?.merchantSubType === null || merchant === undefined) setCustom('0') 
    else setCustom('1')
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = e => {
    setCustom(e?.target?.value);
    setValue(null)
    setAddItem(null)
  }

  const setChange = item => {
    setAddItem(null)
    setCustom('0')
    setValue({value: item})
    setEdited && setEdited(true);
  }

  const setChange1 = item => {
    setAddItem(null)
    setCustom('1')
    setValue({value: item})
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = allData?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      if(exists === -1){
        setAddItem({ value: valueStr1 });
        message.success(t('login.success'))
      } else setAddItem({ value: addItem?.value?.trim(), error: t('profile.variant_error') });
    }
  }

  let classProps = { className: 'lg_radio_select_back_z', classSelect: 'lg_select_login' }
  let sub1Props = { value: value, setValue: setChange, label: t('profile.sale'), data: data, onFocus: onFocusSales };
  let sub2Props = { value: value, setValue: setChange1, label: t('profile.vendor'), data: data1, onFocus: onFocusVendor };

  return (
    <div className='radio_sign_back' >
      <p className='lg_select_lbl_sign'>{label}</p>
      <Radio.Group className= {merchant ? 'pro_radio' : 'pro_radio_back'} onChange={onChange} value={custom}>
        <Radio className='select_radio_check' value={'0'}>{t('profile.sale')}</Radio>
        <div className={merchant ? 'pro_gap' : ''}/>
        <Radio className='select_radio_check' value={'1'}>{t('profile.vendor')}</Radio>
      </Radio.Group>
      <div className={(value?.value === 199 || value?.value === 205) ? 'row' : 'col'}>
        <div style={{overflowY: 'scroll', maxHeight: 150, flex: 1}}>
          {custom === '0' ? <SubSelect {...sub1Props} {...classProps} /> : <SubSelect {...sub2Props}  {...classProps} />}
        </div>
        {(value?.value === 199 || value?.value === 205) && <AddInput
          classBack='lg_input_back1'
          className='lg_m_input'
          setValue={setAddItem}
          value={addItem}
          placeholder={'Нэмж бүртгүүлэх'}
          handleEnter={handleEnter}
          length={100}
          >
        </AddInput>}
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  )
}