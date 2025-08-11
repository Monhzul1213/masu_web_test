import React, { useState, useRef } from 'react';
import { AutoComplete } from 'antd';
import ReactInputMask from 'react-input-mask';

import { DynamicMDIcon } from '../../../all';

export const SelectableCell1 = props => {
  const { data, handleEnter, placeholder, value, setValue, label } = props;
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const onChange = (e )=> {
    setValue({value: e});
  }

  const onSelect = (val) => {
    setValue({value: val})
    setOpen(false)
  };


  const handleSearch = (data, option) => {
    setValue({value: data})
  };
  
  const onClick = (e) => {
    setOpen(true)
  };

  let formatChars = { '1': '[0-9]', '2': '[0-9]', '3': '[0-9]', '4': '[0-9]' };
  let mask = '12:34';

  const onBlur = () => {
    let length = value?.value?.replace(/[-.]/g, '')?.length;
    if(length !== 0 && length !== 5) setValue( {value: value?.value?.replace(/-/g, '0')} );
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div className='invt_time_back' >
      {label && <p className='select_lbl_i' style={style}>{label}</p>}
      <AutoComplete 
        onKeyDown={onKeyDown}
        allowClear 
        filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 }
        style={{ width: '50%' }}
        onSearch={handleSearch}
        className='invt_select'
        onSelect={onSelect}
        onChange={onChange}
        open= {open}
        placeholder={placeholder}
        value={value?.value}
        options={data}>
        <ReactInputMask onBlur={onBlur} mask={mask} maskChar={'-'} formatChars={formatChars} ref={inputRef} className='c_input'/> 
      </AutoComplete>
      <DynamicMDIcon size= {18} name='MdOutlineKeyboardArrowDown' className='tm_select_icon' onClick={onClick}/>
    </div>
  )
}
