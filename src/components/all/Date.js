import React from 'react';
import InputMask from 'react-input-mask';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

export function PlainRange(props){
  const { classBack, label, className, value, disabled, setValue, placeholder, onHide } = props;

  const onOpenChange = show => {
    if(!show) onHide();
  }

  return (
    <div className={classBack}>
      {label && <p className='ih_select_lbl'>{label}</p>}
      <RangePicker
        className={className}
        suffixIcon={null}
        allowClear={false}
        placeholder={placeholder}
        onOpenChange={onOpenChange}
        value={value}
        format='yyyy.MM.DD'
        disabled={disabled}
        onChange={setValue} />
    </div>
  );
}

export function Date(props){
  const { inRow, value, setValue, label, setError, className, disabled, disabledDate, setEdited, allowClear } = props;

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <DatePicker
          className={className ?? 'm_date'}
          value={value?.value}
          disabled={disabled}
          format='yyyy.MM.DD'
          placeholder=''
          allowClear={allowClear ?? false}
          disabledDate={disabledDate}
          onChange={handleChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function Time(props){
  const { inRow, disabled, value, setValue, handleEnter, setError, setEdited, label, onTime } = props;

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
    let length = value?.value?.replace(/[-:]/g, '')?.length;
    if(length !== 0 && length !== 6) setValue({ value: value?.value?.replace(/-/g, '0') });
    onTime && onTime(length ? { value: value?.value?.replace(/-/g, '0') } : null);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  let mask = '12:34:56';
  let formatChars = { '1': '[0-2]', '2': '[0-9]', '3': '[0-5]', '4': '[0-9]', '5': '[0-5]', '6': '[0-9]' };

  let beforeMaskedValueChange = (newState, oldState, userInput) => {
    let { value } = newState;
    if(value.startsWith('2')) formatChars['2'] = '[0-3]';
    else formatChars['2'] = '[0-9]';
    return { value, selection: newState.selection };
  }
  
  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <InputMask
          className='m_input'
          mask={mask}
          style={{width: '100%'}}
          disabled={disabled}
          maskChar='-'
          onKeyDown={onKeyDown}
          placeholder='hh:mm:ss'
          onBlur={onBlur}
          value={value?.value}
          formatChars={formatChars}
          beforeMaskedValueChange={beforeMaskedValueChange}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}