import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

import { DynamicAIIcon } from '../../all/all_m';
const { RangePicker } = DatePicker;


  export function MonthRange(props){
    const { classBack, className, placeholder, onHide, disabled, value, setValue, id, id1, className1, navigateContants, onNavigate, day } = props;
  
    const onClick = isNext => {
      isNext ? onNavigate(value[0], day , navigateContants?.NEXT) : onNavigate(value[1], day ,navigateContants?.PREVIOUS)
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
        <button className={className1 ?? 'mr_btn'} id= {id ?? 'mr_btn1'} onClick={() => onClick(false)}>
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
        <button className={className1 ?? 'mr_btn'} id={id1 ?? 'mr_btn2'} onClick={() => onClick(true)}>
          <DynamicAIIcon name='AiOutlineRight' className='mr_icon' />
        </button>
      </div>
    );
  }
  