import React from 'react';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

export function PlainRange(props){
  const { classBack, label, className, value, disabled, setValue, placeholder, onHide } = props;

  const onOpenChange = show => {
    if(!show) onHide();
  }

  return (
    <div className={classBack}>
      {label && <p className='p_select_lbl'>{label}</p>}
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