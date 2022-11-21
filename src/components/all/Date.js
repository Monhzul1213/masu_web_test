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