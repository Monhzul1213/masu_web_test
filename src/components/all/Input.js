import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DynamicAIIcon } from './DynamicIcon';

export function Input(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, mask, maskChar, inRow,
    length, noBlur, className, classBack } = props;
  const { t } = useTranslation();

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    !noBlur && setValue({ value: value?.value?.trim(), error: value?.error });
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className={classBack ?? 'select_back'} style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <InputMask
          className={className ?? 'm_input'}
          mask={mask}
          disabled={disabled}
          maskChar={maskChar ?? '-'}
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

export function DescrInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, inRow, length, id } = props;
  const { t } = useTranslation();

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error });
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <textarea
          id={id}
          className='m_input_descr'
          disabled={disabled}
          placeholder={placeholder}
          value={value?.value}
          onBlur={onBlur}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function MoneyInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, onBlur } = props;
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';

  const onChange = value => {
    setValue({ value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <CurrencyInput
          className='m_input'
          suffix={suffix}
          allowNegativeValue={false}
          disabled={disabled}
          placeholder={placeholder}
          decimalsLimit={4}
          value={value?.value}
          maxLength={15}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onValueChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function InputPassword(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, length } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    setEditable(!disabled);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error });
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
  }

  const onClickLock = e => {
    e.preventDefault();
    setEditable(true);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1, position: 'relative' } : {position: 'relative'}}>
      <div className='select_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <InputMask
          className='m_input'
          disabled={!editable}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          value={editable ? value?.value : '********'}
          id={visible ? null : 'm_input_password'}
          onChange={onChange} />
      </div>
      {editable
        ? <DynamicAIIcon className='m_input_show' name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
        : <DynamicAIIcon className='m_input_show' name='AiOutlineLock' onClick={onClickLock} />
      }
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}