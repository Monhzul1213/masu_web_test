import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

export const EditableCell = props => {
  const { value: initialValue, row, column: { id, isText, width, autoFocus, length }, updateMyData, cellID } = props;
  const [value, setValue] = useState(initialValue);

  const onBlur = e => {
    updateMyData(row?.index, id, value, e)
  }

  const onValueChange = e => {
    let amt = e?.split(".", row?.original?.allowDecimal ? 2 : 1).join(".").replace(/[-, ]/g, "");
    setValue(amt);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter")
      updateMyData(row?.index, id, value, e);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  const style = { textAlign: 'right', width };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, allowNegativeValue: false,
    disableGroupSeparators: true, style, onKeyDown, autoFocus, id: cellID };

  return isText
    ? (<p className='ed_text'>{value}</p>)
    : (<CurrencyInput {...qtyProps} />)
}