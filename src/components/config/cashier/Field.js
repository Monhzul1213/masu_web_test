import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import InputMask from 'react-input-mask';
import { Select } from 'antd';

const { Option } = Select;

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

  const renderItem = (item, index) => {
    return (<Option key={index} value={item.selectItemValue}>{item.selectItemName}</Option>);
  }

  const onValueChange = value => onChange(value, index);
  const onValueChange1 = e => onChange(e?.target?.value, index);
  const onValueChange2 = value => onChange(value, index);

  return (
    <div>
      <div className='select_back'>
        <p className='select_lbl'>{item?.fieldCaption}</p>
        {item?.fieldType === 'N' ? 
          <CurrencyInput
            className='m_input'
            allowNegativeValue={false}
            placeholder={item?.fieldCaption}
            decimalsLimit={4}
            disableGroupSeparators={true}
            value={item?.fieldValue}
            onKeyDown={onKeyDown}
            onValueChange={onValueChange} />
          : item?.fieldType === 'S' ? 
          <Select
            className='select_m'
            showSearch
            filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={onValueChange2}
            value={item?.fieldValue}
            placeholder={item?.fieldCaption}>
            {item?.selectData?.map(renderItem)}
          </Select>
          :
          <InputMask
            className='m_input'
            onKeyDown={onKeyDown}
            placeholder={item?.fieldCaption}
            value={item?.fieldValue}
            onChange={onValueChange1} />}
      </div>
      {item?.error && <p className='f_input_error'>{item?.fieldCaption} {item?.error}</p>}
    </div>
  );
}