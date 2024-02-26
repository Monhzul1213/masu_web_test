import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

export const EditableCell1 = props => {
  const { value: initialValue, row, column: { id, isText, autoFocus }, updateData, cellID } = props;
  const [value, setValue] = useState(initialValue);

  const onBlur = e => {
    updateData(row?.index, id, value, e)
  }

  const onValueChange = e => {
    let amt = e?.split(".", row?.original?.allowDecimal ? 2 : 1).join(".").replace(/[-, ]/g, "");
    setValue(amt);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter")
    updateData(row?.index, id, value, e);
  }

  const onFocus = e => {
    if(e?.target?.value === '0') setValue('');
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  const style = { textAlign: 'right', width: 80 };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, allowNegativeValue: false,
    disableGroupSeparators: true, style, onKeyDown, autoFocus, id: cellID, onFocus };

  return isText
    ? (<p className='ed_text' style={{textAlign: 'right', paddingRight: 15}}>{value}</p>)
    : (<CurrencyInput {...qtyProps} />)
}