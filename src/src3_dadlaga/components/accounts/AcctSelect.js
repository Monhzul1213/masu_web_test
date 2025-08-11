import React from 'react';
import { Select as AntSelect } from 'antd';

const { Option } = AntSelect;

export function AcctSelect(props){
  const { value, setValue, label, placeholder, data, setError, setEdited, s_value, s_descr, mode, inRow, onFocus,
    loading, disabled, id, inRow1, className } = props;  

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const renderItem = (item, index) => {
    return (
      <Option key={index} value={item[s_value ?? 'value']} name={item?.descr}>
          <div className='cs_item' style={{display: 'flex', flexFlow: 'row', height: 25, alignItems: 'center'}}>
            <p className='cs_name' style={{width: 80 }}> {item[s_value ?? 'label']}</p>
            <p className='cs_name'style={{width: 350 }} >{item[s_descr ?? 'label']}</p>
          </div>
      </Option>);
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? inRow1 ? {flex: 1,  maxWidth: 300 } : {flex: 1} : {}}>
      <div className= {className ?? 'select_back'} style={backStyle} id={id}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntSelect
          mode={mode}
          loading={loading}
          disabled={disabled}
          className='select_m'
          showSearch
          filterOption={filterOption}
          onChange={handleChange}
          value={value?.value}
          onFocus={() => onFocus && onFocus()}
          // suffixIcon={<DynamicAIIcon name='AiFillCaretDown' className='select_icon' style={style} />}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}