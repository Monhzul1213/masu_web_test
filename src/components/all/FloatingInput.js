import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from './DynamicIcon';

export function FloatingInput(props){
  const { t } = useTranslation();
  const { text, value, setValue, setError, handleEnter, id, disabled, length, isLogin } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    e?.target?.value?.length > length
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onBlur = () => {
    !id && setValue({ value: value?.value?.trim(), error: value?.error });
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

  const style = value?.error ? { borderColor: '#e41051' } : {};
  const style1 = value?.error ? { color: '#e41051' } : {};
  const inputProps = { className: 'f_input_back', value: value?.value, onChange, onKeyDown, style, onBlur, placeholder: text, disabled };

  return (
    <div className='f_input_container' id={id}>
      <label className='f_input_label' style={style1}>{text}</label>
      <input {...inputProps} name={isLogin ? '' : 'notsearch_password'} />
      {value?.error && <p className='f_input_error'>{id ? '' : text} {value?.error}</p>}
    </div>
  )
}

export function FloatingPassword(props){
  const { text, value, setValue, setError, handleEnter, isLogin } = props;
  const [visible, setVisible] = useState(false);

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
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

  const style = value?.error ? { borderColor: '#e41051' } : {};
  const style1 = value?.error ? { color: '#e41051' } : {};
  const inputProps = { className: 'f_input_back', value: value?.value, onChange, onKeyDown, style, onBlur, placeholder: text,
    id: visible ? null : 'm_input_password' };

  return (
    <div className='f_input_container'>
      <label className='f_input_label' style={style1}>{text}</label>
      <input {...inputProps} name={isLogin ? '' : 'notsearch_password'} />
      <DynamicAIIcon className='f_input_show' name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
      {value?.error && <p className='f_input_error'>{text} {value?.error}</p>}
    </div>
  )
}