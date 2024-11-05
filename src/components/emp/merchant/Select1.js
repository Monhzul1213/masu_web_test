import React from 'react';
import { Select, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { AddInput } from './AddInput';

const { Option } = Select;

const SubSelect = props => {
  const { value, setValue, data, onFocus, placeholder} = props;

  const renderItem = (item, index) => {
    return (<Option key={index} value={item['valueNum']} label={item['valueStr1']}>{item['valueStr1']}</Option>);
  }

  return (
    <div className='select_back_z'>
      <Select
        className='select_m'
        onChange={setValue}
        value={value?.value}
        placeholder={placeholder}
        onFocus={() => onFocus && onFocus()}
        >
        {data?.map(renderItem)}
      </Select>
    </div>
  )
}

export function Select1(props){
  const {label, value, setValue, data, onFocus, addItem, setAddItem, setEdited, placeholder } = props;
  const { t } = useTranslation();



  const setChange = item => {
    setAddItem(null)
    setValue({value: item})
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = data?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      if(exists === -1){
        setAddItem({ value: valueStr1 });
        message.success(t('login.success'))
      } else setAddItem({ value: addItem?.value?.trim(), error: t('profile.variant_error') });
    }
  }


  let sub1Props = { value: value, setValue: setChange, data, onFocus, placeholder };

  return (
    <div className='radio_back' >
      <p className='select_lbl' >{label}</p>
      <div className={(value?.value === 200) ? 'row' : 'col'}>
        <div className='list_scroll' style={{overflowY: 'scroll', maxHeight: 150}}>
           <SubSelect {...sub1Props}/>
        </div>
        {(value?.value === 200) && <AddInput
          setValue={setAddItem}
          value={addItem}
          placeholder={'Нэмж бүртгүүлэх'}
          handleEnter={handleEnter}
          length={100}
          />}
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  )
}