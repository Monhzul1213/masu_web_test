import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

export const EditableCell = ({ value: initialValue, row, column: { id, isText, isMoney, isQty, width, autoFocus }, updateMyData, disabled }) => {
  const [value, setValue] = useState(initialValue)
  const hasError = row?.original?.error === id;
  const notEditable = disabled && !hasError;

  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = e => {
    updateMyData(row?.index, id, value, e)
  }

  const onValueChange = e => {
    setValue(e);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter")
      updateMyData(row?.index, id, value, e);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  const errorStyle = hasError ? { borderColor: '#e41051' } : {};
  const style = {...{ textAlign: 'right', width }, ...errorStyle};
  const style1 = {...{ width }, ...errorStyle};
  const moneyProps = { className: 'ed_input', prefix: '₮', allowNegativeValue: false, decimalsLimit: 4, value, maxLength: 15, onValueChange, onBlur, style,
    onKeyDown, autoFocus, disabled: notEditable };
  const textProps = { className: 'ed_input', value, onChange, onBlur, onKeyDown, autoFocus, style: width ? style1 : errorStyle,
    disabled: notEditable };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, allowNegativeValue: false,
    disableGroupSeparators: true, style, onKeyDown, autoFocus, disabled: notEditable };

  return isText
    ? (<p className='ed_text'>{value}</p>)
    : isMoney 
      ? (<CurrencyInput {...moneyProps} />)
      : isQty
        ? (<CurrencyInput {...qtyProps} />)
        : (<input {...textProps} />)
}
