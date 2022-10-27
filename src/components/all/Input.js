import React from 'react';
import InputMask from 'react-input-mask';

export function Input(props){
  const { value, setValue, label, placeholder, disabled, setError, handleEnter, mask, style1, style2 } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") handleEnter && handleEnter(e);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div style={style1}>
      <div className='select_back' style={{...style, ...style2}}>
        <p className='select_lbl' style={style}>{label}</p>
        <InputMask
          className='m_input'
          mask={mask}
          disabled={disabled}
          maskChar='-'
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}