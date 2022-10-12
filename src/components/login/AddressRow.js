import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { DynamicAIIcon } from '../all';

const { Option } = Select;

function AddressSelect(props){
  const { data, value, setValue, text } = props;

  const handleChange = e => {
    setValue({ value: e });
  }

  const renderOption = (item, index) => {
    return (<Option key={index} value={item?.value}>{item?.label}</Option>);
  }

  return (
    <Select
      className='addr_select'
      onChange={handleChange}
      value={value?.value}
      placeholder={text}
      suffixIcon={<DynamicAIIcon name='AiFillCaretDown' />}>
      {data?.map(renderOption)}
    </Select>
  );
}

export function AddressRow(props){
  const { t } = useTranslation();
  const { text, addr1, addr2, addr3, setAddr1, setAddr2, setAddr3, addr1List, addr2List, addr3List } = props;

  const style = addr1?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const addr1Props = { data: addr1List, value: addr1, setValue: setAddr1, text: t('login.addr1') };
  const addr2Props = { data: addr2List, value: addr2, setValue: setAddr2, text: t('login.addr2') };
  const addr3Props = { data: addr3List, value: addr3, setValue: setAddr3, text: t('login.addr3') };

  return (
    <div className='input_container'>
      <label className='input_label' style={style}>{text}</label>
      <div className='addr_row'>
        <AddressSelect {...addr1Props} />
        <AddressSelect {...addr2Props} />
        <AddressSelect {...addr3Props} />
      </div>
    </div>
  );
}