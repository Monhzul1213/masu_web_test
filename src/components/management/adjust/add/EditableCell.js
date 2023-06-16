import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';

export const EditableCell = props => {
  const { value: initialValue, row, column: { id, minWidth }, updateMyData } = props;
  const [value, setValue] = useState(initialValue);
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';
  const width = minWidth - 18;
  const disabled = row?.original?.itemType === 'II';

  const onBlur = e => updateMyData(row?.index, id, value, e)
  const onValueChange = e => setValue(e);
  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") updateMyData(row?.index, id, value, e);
  }
  const onFocus = e => {
    if(e?.target?.value === '0') setValue('');
  }

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const style = { textAlign: 'right', width };
  const moneyProps = { style, suffix, value, disabled, onValueChange, onBlur, onFocus, onKeyDown };

  return (
    <CurrencyInput
      {...moneyProps}
      className='ed_input'
      allowNegativeValue={false}
      decimalsLimit={4}
      maxLength={15} />
  );
}