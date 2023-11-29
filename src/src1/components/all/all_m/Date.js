import React, { useState } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { DatePicker, Dropdown, Radio, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { timeList, timeList1 } from '../../../../helpers';
import { DynamicAIIcon } from './DynamicIcon';
const { RangePicker } = DatePicker;
const { Option } = Select;

export function PlainRange(props){
    const { classBack, label, className, value, disabled, setValue, placeholder, onHide } = props;
  
    const onOpenChange = show => {
      if(!show) onHide();
    }
  
    return (
      <div className={classBack}>
        {label && <p className='ih_select_lbl'>{label}</p>}
        <RangePicker
          className={className}
          suffixIcon={null}
          allowClear={false}
          placeholder={placeholder}
          onOpenChange={onOpenChange}
          value={value}
          format='yyyy.MM.DD'
          disabled={disabled}
          onChange={setValue} />
      </div>
    );
  }
 
  export function MonthRange(props){
    const { classBack, className, placeholder, onHide, disabled, value, setValue } = props;
  
    const onClick = isNext => {
      const diff = value[1]?.diff(value[0], 'days');
      const add = (diff + 1) * (isNext ? 1 : -1);
      const begin = moment(value[0]?.add(add, 'days'));
      const end = moment(value[1]?.add(add, 'days'));
      setValue([begin, end]);
      onHide();
    }
  
    const onOpenChange = show => {
      if(!show) onHide();
    }
  
    return (
      <div className={classBack}>
        <button className='mr_btn' id='mr_btn1' onClick={() => onClick(false)}>
          <DynamicAIIcon name='AiOutlineLeft' className='mr_icon' />
        </button>
        <DynamicAIIcon name='AiOutlineCalendar' className='mr_cal' />
        <RangePicker
          className={className}
          suffixIcon={null}
          allowClear={false}
          placeholder={placeholder}
          onOpenChange={onOpenChange}
          value={value}
          format='yyyy.MM.DD'
          disabled={disabled}
          onChange={setValue} />
        <button className='mr_btn' id='mr_btn2' onClick={() => onClick(true)}>
          <DynamicAIIcon name='AiOutlineRight' className='mr_icon' />
        </button>
      </div>
    );
  }
  
  const TimeSelect = props => {
    const { label, value, setValue } = props;
  
    const renderItem = item => {
      return (<Option key={item} value={item}>{item}</Option>);
    }
  
    return (
      <div className='mr_time_back'>
        <p className='mr_time_label'>{label}</p>
        <Select
          className='mr_time_select'
          onChange={setValue}
          value={value}>
          {timeList?.map(renderItem)}
        </Select>
      </div>
    )
  }
  
  export function TimeRange(props){
    const { classBack, label, value, setValue, onHide } = props;
    const [custom, setCustom] = useState(false);
    const [text, setText] = useState(label);
    const { t } = useTranslation();
  
    const onChange = e => {
      if(e?.target?.value){
        setValue(['00:00', '23:00']);
        setText('00:00 - 23:00');
      } else {
        setValue(null);
        setText(label);
      }
      setCustom(e?.target?.value);
    }
  
    const onOpenChange = show => {
      if(!show) onHide();
    }
  
    const setTime = data => {
      setValue(data);
      setText(data[0] + ' - ' + data[1]);
    }
  
  
    const menu = () => {
      return (
        <div className='mr_dropdown'>
          <Radio.Group className='mr_radio' onChange={onChange} value={custom}>
            <Radio value={false}>{t('report_receipt.all_day')}</Radio>
            <Radio value={true}>{t('report_receipt.custom_day')}</Radio>
          </Radio.Group>
          {custom && <div className='mr_times'>
            <TimeSelect label={t('time.t_start')} value={value[0]} setValue={val => setTime([val, value[1]])} />
            <div className='gap' />
            <TimeSelect label={t('time.t_end')} value={value[1]} setValue={val => setTime([value[0], val])} />
          </div>}
        </div>
      )
    }
  
    return (
      <Dropdown overlay={menu} trigger='click' onOpenChange={onOpenChange}>
        <button className={classBack}>
          <DynamicAIIcon name='AiOutlineClockCircle' className='mr_cal' />
          <p className='mr_label'>{text}</p>
        </button>
      </Dropdown>
    )
  }

  export function Time(props){
    const { inRow, disabled, value, setValue, handleEnter, setError, setEdited, label, onTime } = props;
  
    const onChange = e => {
      setValue({ value: e.target.value });
      setError && setError(null);
      setEdited && setEdited(true);
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
  
    const onBlur = () => {
      let length = value?.value?.replace(/[-:]/g, '')?.length;
      if(length !== 0 && length !== 6) setValue({ value: value?.value?.replace(/-/g, '0') });
      onTime && onTime(length ? { value: value?.value?.replace(/-/g, '0') } : null);
    }
  
    const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
    const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;
  
    let mask = '12.34';
    let formatChars = { '1': '[0-2]', '2': '[0-9]', '3': '[0-5]', '4': '[0-9]' };
  
    let beforeMaskedValueChange = (newState, oldState, userInput) => {
      let { value } = newState;
      if(value.startsWith('2')) formatChars['2'] = '[0-3]';
      else formatChars['2'] = '[0-9]';
      return { value, selection: newState.selection };
    }
    
    return (
      <div style={inRow ? { flex: 1 } : {}}>
        <div className='select_back' style={backStyle}>
          <p className='select_lbl' style={style}>{label}</p>
          <InputMask
            className='m_input'
            mask={mask}
            style={{width: '100%'}}
            disabled={disabled}
            maskChar='-'
            onKeyDown={onKeyDown}
            placeholder='hh:mm:ss'
            onBlur={onBlur}
            value={value?.value}
            formatChars={formatChars}
            beforeMaskedValueChange={beforeMaskedValueChange}
            onChange={onChange} />
        </div>
        {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
      </div>
    );
  }

  export function Date(props){
    const { inRow, value, setValue, label, className, disabled, classBack, placeholder, onHide} = props;
  
  
    const onOpenChange = show => {
      if(!show) onHide();
    }
    
    return (
      <div style={inRow ? { flex: 1 } : {}}>
        <div className={classBack}>
          {label && <p className='ih_select_lbl'>{label}</p>}
          <DatePicker
            className={className}
            value={value}
            disabled={disabled}
            format='yyyy.MM.DD'
            onOpenChange={onOpenChange}
            placeholder={placeholder ?? ''}
            suffixIcon={null}
            allowClear={false}
            onChange={setValue} 
            />
        </div>
        {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
      </div>
    );
  }

  const TimeSelect1 = props => {
    const { value, setValue } = props;
  
    const renderItem = item => {
      return (<Option key={item} value={item}>{item}</Option>);
    }
  
    return (
      <div className='tm_time_back'>
        <Select
          className='tm_time_select'
          onChange={setValue}
          value={value}>
          {timeList1?.map(renderItem)}
        </Select>
      </div>
    )
  }
  
  export function SelectTime(props){
    const { value, setValue } = props;
    const { t } = useTranslation();
  
    const setTime = data => {
      setValue(data);
    }
  
    return (
      <div className='tm_times'>
        <TimeSelect1 value={value[0]} setValue={val => setTime([val, value[1]])} />
        <div className='gap' />
        <TimeSelect1 value={value[1]} setValue={val => setTime([value[0], val])} />
      </div>
    )
  }