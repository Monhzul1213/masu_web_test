import React from 'react';
import { useTranslation } from 'react-i18next';

export function CardNote(props){
  const { label, value, setValue, handleEnter, disabled , inRow, placeholder, length, setError, setEdited} = props;
  const { t } = useTranslation();

  const onChange = e => {
    e?.target?.value?.length > length 
      ? setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
      : setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key === 'Enter') handleEnter && handleEnter(e);
  }
  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='cust_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <textarea className='c_input'
          disabled={disabled}
          value={value?.value}
          onChange={onChange} 
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>

  )
}