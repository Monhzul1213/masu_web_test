import React from 'react';
import InputMask from 'react-input-mask';

export function MaskedInput(props){
  const { value, setValue, label, mask, placeholder } = props;

  const onChange = e => {
    setValue(e?.target?.value);
  }

  return (
    <div className='mask_row'>
      <p className='mask_lbl'>{label}</p>
      <InputMask
        className='mask_input'
        mask={mask}
        maskChar='-'
        placeholder={placeholder}
        value={value?.value}
        onChange={onChange} />
    </div>
  );
}