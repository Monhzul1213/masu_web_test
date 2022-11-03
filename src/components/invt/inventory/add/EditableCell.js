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

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter")
      updateMyData(index, id, value);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  const style = { textAlign: 'right', width };
  const moneyProps = { className: 'ed_input', prefix: '₮', allowNegativeValue: false, decimalsLimit: 4, value, maxLength: 15, onValueChange, onBlur, style,
    onKeyDown };
  const textProps = { className: 'ed_input', value, onChange, onBlur, onKeyDown };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, allowNegativeValue: false,
    disableGroupSeparators: true, style, onKeyDown };

  return disabled
    ? (<p className='ed_text'>{value}</p>)
    : isMoney 
      ? (<CurrencyInput {...moneyProps} />)
      : isQty
        ? (<CurrencyInput {...qtyProps} />)
        : (<input {...textProps} />)
}

