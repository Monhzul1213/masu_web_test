import React from 'react';
import { Radio as AntRadio } from 'antd';

export function Radio(props){
  const { value, setValue, inRow, label, data, setError, s_value, s_descr } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  };

  const renderItem = (item, index) => {
    return (<AntRadio key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</AntRadio>);
  }

  const style = value?.error ? { color: '#e41051' } : {};

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={inRow ? { margin: '0 0 0 0', borderColor: 'transparent' } : { borderColor: 'transparent' }}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntRadio.Group className='radio_back' onChange={onChange} value={value?.value}>
          {data?.map(renderItem)}
        </AntRadio.Group>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
};