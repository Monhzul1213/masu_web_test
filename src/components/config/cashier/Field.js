import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import InputMask from 'react-input-mask';

export function Field(props){
  const { item, index, onChange } = props;

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      const form = e.target.form;
      if(form){
        const index = [...form].indexOf(e.target);
        form.elements[index + 1]?.focus();
        e.preventDefault();
      }
    }
  }

  const onValueChange = value => onChange(value, index);
  const onValueChange1 = e => onChange(e?.target?.value, index);

  return (
    <div>
      <div className='select_back'>
        <p className='select_lbl'>{item?.fieldName}</p>
        {item?.fieldType === 'N' ? 
          <CurrencyInput
            className='m_input'
            allowNegativeValue={false}
            placeholder={item?.fieldName}
            decimalsLimit={4}
            disableGroupSeparators={true}
            value={item?.fieldValue}
            onKeyDown={onKeyDown}
            onValueChange={onValueChange} />
          :
          <InputMask
            className='m_input'
            onKeyDown={onKeyDown}
            placeholder={item?.fieldName}
            value={item?.fieldValue}
            onChange={onValueChange1} />}
      </div>
      {item?.error && <p className='f_input_error'>{item?.fieldName} {item?.error}</p>}
    </div>
  );
}