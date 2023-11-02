import React, { useState, useRef } from 'react';
// import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import {  DynamicAIIcon, IconButton , Input} from '../../all';
import { add } from '../../../helpers';
import { Divider, Select, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option, OptGroup } = Select;
  
export function SubSelect(props){
    const { label, value, setValue, data, data1, onFocus, addItem, setAddItem, setData, custom, setCustom } = props;
    const { t } = useTranslation();

    const [items, setItems] = useState(['jack', 'lucy']);
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const onNameChange = (event) => {
      setName(event.target.value);
    };
    const addItem1 = (e) => {
      e.preventDefault();
      setData([...data, name]);
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };
  
    // const onNameChange = (e) => {
    //   setAddItem(e.target.value);
    // };
    const handleEnter = e => {
      e?.preventDefault();
      let valueStr1 = addItem?.value?.trim();
      if(valueStr1){
        let exists = data?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
        console.log(valueStr1)
        if(exists === -1){
          let item = { valueStr1 };
          setData(old => [...old, item]);
          setAddItem({ value: '' });
          // setEdited && setEdited(true);
        } else setAddItem({ value: addItem?.value?.trim(), error: t('inventory.variant_error') });
      }
    }

    const handleChange = e => {
      setValue({ value: e });
      setCustom(e);
    }

    const renderItem = (item, index) => {
        return (<Option key={index} value={item['valueNum']} label = {item['valueNum']}>{item['valueStr1']}</Option>);
    }
    const renderItem1 = (item, index) => {   
        return (
            <Option key={index} value={item['valueNum'] === 204} label = {item['valueNum']}>
              { item?.valueNum === 204 ? <Input handleEnter ={handleEnter} value={addItem} setValue ={setAddItem} placeholder = {item['valueStr1']}/> : item['valueStr1']}
              {/* {item['valueStr1']} */}
            </Option>
            );
    }
          
    return (
        <div className='select_back' >
            <p className='select_lbl' >{label}</p>
            <Select
                className='select_m'
                value={value?.value}
                onFocus={() => onFocus && onFocus()}
                onChange={handleChange}
                placeholder={label}
               >
              {data1.map(renderItem1)}              
            </Select>
        </div>
    )
  }
