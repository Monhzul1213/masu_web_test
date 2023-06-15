import React from 'react';
import InputMask from 'react-input-mask';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';

export function Input(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, mask, inRow, id, length } = props;
  const { t } = useTranslation();
    
  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
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
    <div style={inRow ? { flex: 1 } : {}} id={id}>
      <div className='cust_back' style={backStyle} >
        {label && <p className='select_lbl' style={style}>{label}</p>}
            <InputMask
            className='c_input'
            mask={mask}
            disabled={disabled}
            maskChar='-'
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            value={value?.value}
            onChange={onChange} 
            />
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function Percent(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow  } = props;
   
  const onChange = e => {
    setValue({ value: e.target.value });
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
    let length = value?.value?.replace(/[-.]/g, '')?.length;
    if(length !== 0 && length !== 4) setValue({ value: value?.value?.replace(/-/g, '0') });
  }
  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;
  let formatChars = { '1': '[0-9]', '2': '[0-9]', '3': '[0-9]', '4': '[0-9]' };
  let mask = '12.34';

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='cust_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <div className='cust_back1'>
            <InputMask
            className='c_input'
            mask={mask}
            disabled={disabled}
            maskChar='-'
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            value={value?.value}
            formatChars={formatChars}
            onChange={onChange} 
            style={{width: '100%'}}
            />
        </div>
        
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}
export function DescrInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, inRow, length } = props;
  const { t } = useTranslation();

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <textarea
          className='m_input_descr'
          disabled={disabled}
          placeholder={placeholder}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function MoneyInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, onBlur } = props;

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
          prefix= '₮'
          allowNegativeValue={false}
          disabled={disabled}
          placeholder={placeholder}
          decimalsLimit={4}
          value={value?.value}
          maxLength= {8} 
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onValueChange={onChange}
           />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function Input1(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, mask, inRow, length } = props;
  const { t } = useTranslation();

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
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
      <div className='cust_back1' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <div className='cust_back2'>
            <InputMask
            className='c_input1'
            mask={mask}
            disabled={disabled}
            maskChar='-'
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            value={value?.value}
            onChange={onChange} />
        </div>
        
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

