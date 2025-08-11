import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';


export const EditableCell = props => {
  const { value: initialValue, row, column: { id, isText, isMoney, isQty, width, minWidth, autoFocus, length }, updateMyData, disabled, cellID } = props;
  const [value, setValue] = useState(initialValue);
  const hasError = row?.original?.error === id;
  const notEditable = disabled && !hasError;
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';
  const width1 = minWidth ? (minWidth - 18) : width;

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid) setValue(value);
    else if(e?.target?.value?.length > length) setValue(value);
    else setValue(e.target.value);
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

  const onFocus = e => {
    if(e?.target?.value === '0') setValue('');
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue, row?.original?.edited])
  
  const errorStyle = hasError ? { borderColor: '#e41051' } : {};
  const style = {...{ textAlign: 'right', width: width1 }, ...errorStyle};
  const style1 = {...{ width: width1 }, ...errorStyle};
  const moneyProps = { className: 'ed_input', suffix, allowNegativeValue: false, decimalsLimit: 4, value, maxLength: 15, onValueChange, onBlur, style,
    onKeyDown, autoFocus, disabled: notEditable, id: cellID, onFocus };
  const textProps = { className: 'ed_input', value, onChange, onBlur, onKeyDown, autoFocus, style: width ? style1 : errorStyle,
    disabled: notEditable, id: cellID, onFocus };
  const qtyProps = { className: 'ed_input', decimalsLimit: 2, value, maxLength: 15, onValueChange, onBlur, allowNegativeValue: false,
    disableGroupSeparators: true, style, onKeyDown, autoFocus, disabled: notEditable, id: cellID, onFocus };

  return isText
    ? (<p className='ed_text'>{value}</p>)
    : isMoney || (row?.original?.isMoney1 && id === 'discountValue')
      ? (<CurrencyInput {...moneyProps} />)
      : isQty
        ? (<CurrencyInput {...qtyProps} />)
        : (<input {...textProps} />)
}