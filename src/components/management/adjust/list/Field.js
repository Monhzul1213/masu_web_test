import React from 'react';
import { message, Select as AntSelect } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../../../css/config.css';
import { bank_icons } from '../../../../assets';
import { DynamicAIIcon } from '../../../all';
const { Option } = AntSelect;

export function Select(props){
  const { label, value, setValue, data } = props;

  const renderItem = (item, index) => {
    return (
      <Option key={index} value={index}>
        <img className='pay_select_icon' src={bank_icons[item?.logo]} alt={item?.bank} />
        {item?.label}
      </Option>
    );
  }

  return (
    <div className='pay_field_back'>
      <p className='pay_field_label'>{label}</p>
      <AntSelect
        className='pay_select'
        onChange={setValue}
        value={value}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}

export function Field(props){
  const { label, value, copy, isBold } = props;

  const onCopy = () => message.success('Copied to clipboard');

  return (
    <div className='pay_field_back' id='es_row'>
      <div style={{flex: 1}}>
        <p className='pay_field_label'>{label}</p>
        <p className='pay_field_value' style={{fontWeight: isBold ? '600' : '450', color: isBold ? 'var(--logo1-color)' : 'var(--text-color)'}}>{value}</p>
      </div>
      <CopyToClipboard text={copy ?? value} onCopy={onCopy}>
        <DynamicAIIcon name='AiOutlineCopy' className='pay_field_copy' />
      </CopyToClipboard>
    </div>
  );
}