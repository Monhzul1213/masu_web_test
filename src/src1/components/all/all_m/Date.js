import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, Dropdown, Radio, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { timeList } from '../../../../helpers';
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
        {label && <p className='p_select_lbl'>{label}</p>}
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