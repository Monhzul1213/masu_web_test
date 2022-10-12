import React, { useState } from 'react';

import { DynamicAIIcon } from './DynamicIcon';

export function FloatingInput(props){
  const { text, value, setValue, setError, handleEnter } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const inputProps = { className: 'f_input_back', value: value?.value, onChange, onKeyDown: handleEnter, style };

  return (
    <div className='f_input_container'>
      <input {...inputProps} />
      <label className={value?.value && 'f_input_label'} style={style}>{text}</label>
      {value?.error && <p className='f_input_error'>{text} {value?.error}</p>}
    </div>
  )
}

export function FloatingPassword(props){
  const { text, value, setValue, setError, handleEnter } = props;
  const [visible, setVisible] = useState(false);

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const inputProps = { className: 'f_input_back', value: value?.value, type: visible ? 'text' : 'password', onChange, onKeyDown: handleEnter, style };

  return (
    <div className='f_input_container'>
      <input {...inputProps} />
      <label className={value?.value && 'f_input_label'} style={style}>{text}</label>
      <DynamicAIIcon className='f_input_show' name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
      {value?.error && <p className='f_input_error'>{text} {value?.error}</p>}
    </div>
  )
}