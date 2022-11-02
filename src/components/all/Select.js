import React from 'react';
import { Select as AntSelect } from 'antd';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from './DynamicIcon';
const { Option } = AntSelect;

export function Select(props){
  const { value, setValue, label, placeholder, data, setError, s_value, s_descr, mode, inRow, onFocus, loading } = props;
  const { t } = useTranslation();
  
  let maxTagPlaceholder = value?.value?.length === data?.length ? t('cashier.pay_shop3') : (value?.value?.length + t('cashier.pay_shop4'));

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
  }

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntSelect
          mode={mode}
          loading={loading}
          className='select_m'
          showSearch
          filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={handleChange}
          value={value?.value}
          onFocus={onFocus}
          maxTagCount={0}
          maxTagPlaceholder={maxTagPlaceholder}
          // suffixIcon={<DynamicAIIcon name='AiFillCaretDown' className='select_icon' style={style} />}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function PlainSelect(props){
  const { value, setValue, placeholder, data, s_value, s_descr, className } = props;
  
  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  return (
    <AntSelect
      className={className}
      showSearch
      filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={setValue}
      value={value}
      placeholder={placeholder}
      suffixIcon={<DynamicAIIcon name='AiFillCaretDown' className='select_icon' />}>
      {data?.map(renderItem)}
    </AntSelect>
  );
}