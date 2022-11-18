import React from 'react';
import { DatePicker } from 'antd';

import { DynamicAIIcon } from './DynamicIcon';
const { RangePicker } = DatePicker;

export function PlainRange(props){
  const { classBack, label, className, value, disabled, setValue, placeholder } = props;

  return (
    <div className={classBack}>
      {label && <p className='p_select_lbl'>{label}</p>}
      <RangePicker
        className={className}
        suffixIcon={null}
        allowClear={false}
        placeholder={placeholder}
        value={value}
        format='yyyy.MM.DD'
        disabled={disabled}
        onChange={setValue} />
      <DynamicAIIcon className='date_icon' name='AiOutlineCalendar' />
    </div>
  );
}