import React from 'react';
import InputMask from 'react-input-mask';

export function MaskedInput(props){
  const { value, setValue, label, mask, placeholder, handleEnter, setError } = props;

  const onChange = e => {
    setError && setError(null);
    setValue({ value: e?.target?.value });
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1].focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error });
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
          onBlur={onBlur}
          placeholder={placeholder}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}