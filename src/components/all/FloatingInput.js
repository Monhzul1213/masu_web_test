import React from 'react';

export function FloatingInput(props){
  const { type, text, value, setValue, setError } = props;

  const handleChange = e => {
    setValue(e.target.value);
    setError && setError(null);
  }

  return (
    <div className='f_input_container'>
      <input className='f_input_back' type={type ?? 'text'} invalid={true} onChange={handleChange} />
      <label className={value && 'f_input_label'}>{text}</label>
    </div>
  )
}