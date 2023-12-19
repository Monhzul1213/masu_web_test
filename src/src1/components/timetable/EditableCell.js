import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'antd';
import { DynamicMDIcon } from '../all/all_m';
import ReactInputMask from 'react-input-mask';
// import { Input, Percent } from '../all/all_m';

export const SelectableCell = props => {
  const { row, column: { id, width }, updateMyData, data, initialValue, handleEnter } = props;
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // useEffect(() => {
  //   if(select) inputRef?.current?.focus();
  //   return () => {};
  // }, [select])
  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e )=> {
    // setValue(e);
    updateMyData(row?.index, id, e)
  }

  const onSelect = (val) => {
    // setSelect(!select)
    setValue(val)
    setOpen(false)
  };


  const handleSearch = (data, option) => {
    setValue(data)
    console.log(data);
  };
  
  const onClick = (e) => {
    setOpen(true)
  };

  let formatChars = { '1': '[0-9]', '2': '[0-9]', '3': '[0-9]', '4': '[0-9]' };
  let mask = '12:34';

  const onBlur = () => {
    let length = value?.replace(/[-.]/g, '')?.length;
    if(length !== 0 && length !== 5) setValue( value?.replace(/-/g, '0') );
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
  
  return (
    <div className='tm_select_backs' style={{ width }}>
      <AutoComplete 
        onKeyDown={onKeyDown}
        allowClear 
        filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 }
        style={{ width: 70 }}
        onSearch={handleSearch}
        className='tm_select'
        onSelect={onSelect}
        onChange={onChange}
        open= {open}
        // onClear={onClear}
        value={value}
        options={data}>
        <ReactInputMask onBlur={onBlur} mask={mask} maskChar={'-'} formatChars={formatChars} ref={inputRef} className='c_input'/> 
      </AutoComplete>
      <DynamicMDIcon size= {18} name='MdOutlineKeyboardArrowDown' className='tm_select_icon' onClick={onClick}/>
    </div>
  )
}
