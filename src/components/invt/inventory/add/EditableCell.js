import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

export const EditableCell = ({ value: initialValue, row: { index }, column: { id, disabled, isMoney, isQty, width }, updateMyData }) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(index, id, value)
  }

  const onValueChange = e => {
    setValue(e);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  const style = { width };
  const moneyProps = { className: 'ed_input', prefix: '₮', allowNegativeValue: false, decimalsLimit: 4, value, maxLength: 15, onValueChange, onBlur, style };
  const textProps = { className: 'ed_input', value, onChange, onBlur, style };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, disableGroupSeparators: true, style };

  return disabled
    ? (<p className='ed_text'>{value}</p>)
    : isMoney 
      ? (<CurrencyInput {...moneyProps} />)
      : isQty
        ? (<CurrencyInput {...qtyProps} />)
        : (<input {...textProps} />)
}

