import React from 'react';
import { Select as AntSelect } from 'antd';

import '../../../../css/config.css';
import { bank_icons } from '../../../../assets';
const { Option } = AntSelect;

export function Select(props){
  const { label, value, setValue, data } = props;

  const renderItem = (item, index) => {
    return (
      <Option key={index} value={item?.logo}>
        <img className='es_select_icon' src={bank_icons[item?.logo]} alt={item?.bank} />
        {item?.bank}
      </Option>
    );
  }

  return (
    <div className='es_field_back'>
      <p className='es_field_label'>{label}</p>
      <AntSelect
        className='es_select'
        onChange={setValue}
        value={value}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}