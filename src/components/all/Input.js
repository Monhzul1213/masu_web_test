import React from 'react';

export function Input(props){
  const { value, setValue, label, placeholder, disabled, setError, handleEnter } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") handleEnter && handleEnter(e);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div>
      <div className='select_back' style={style}>
        <p className='select_lbl' style={style}>{label}</p>
        <input
          className='m_input'
          disabled={disabled}
          value={value?.value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}