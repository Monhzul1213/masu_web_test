import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const SelectableCell = props => {
  const { value: initialValue, row, column: { id, width }, updateMyData, disabled, data, s_value, s_descr } = props;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = e => {
    // setValue(e);
    updateMyData(row?.index, id, e)
  }

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  return (
    <div className='ed_select_back' style={{ width }}>
      <Select
        className='ed_select'
        showSearch
        filterSort={(a, b) =>(a?.value ?? '').toLowerCase().localeCompare(( b?.value ?? '').toLowerCase())}
        style={{ width }}
        disabled={disabled}
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={onChange}
        value={value}>
        {data?.map(renderItem)}
      </Select>
    </div>
  )
}