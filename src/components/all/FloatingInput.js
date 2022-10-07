import React, { useState } from 'react';

import { DynamicAIIcon } from './DynamicIcon';

export function FloatingInput(props){
  const { text, value, setValue, setError } = props;

  const handleChange = e => {
    setValue(e.target.value);
    setError && setError(null);
  }

  return (
    <div className='f_input_container'>
      <input className='f_input_back' onChange={handleChange} />
      <label className={value && 'f_input_label'}>{text}</label>
    </div>
  )
}

export function FloatingPassword(props){
  const { text, value, setValue, setError } = props;
  const [visible, setVisible] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
    setError && setError(null);
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
  }

  return (
    <div className='f_input_container'>
      <input autoFocus className='f_input_back' type={visible ? 'text' : 'password'} onChange={handleChange} />
      <label className={value && 'f_input_label'}>{text}</label>
      <DynamicAIIcon className='f_input_show' name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
    </div>
  )
}