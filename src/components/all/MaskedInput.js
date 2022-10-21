import React from 'react';
import InputMask from 'react-input-mask';

export function MaskedInput(props){
  const { value, setValue, label, mask, placeholder, handleEnter, setError } = props;

  const onChange = e => {
    setError && setError(null);
    setValue({ value: e?.target?.value });
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") handleEnter && handleEnter(e);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div>
      <div className='mask_row' style={style}>
        <p className='mask_lbl' style={style}>{label}</p>
        <InputMask
          className='mask_input'
          mask={mask}
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