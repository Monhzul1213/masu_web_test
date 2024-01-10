import React, { useState } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';

export function Day(props){
  const { customDayHeader, setDay, resourceMap } = props;
  const [text, setText] = useState(moment()?.format('MMMM YYYY'));

  const onChange = (value) => {
    setText(value.format('MMMM YYYY'))
    setDay(value.format('MMMM YYYY'))
    customDayHeader({label: value})
    // console.log(value)
  };

  return ( 
    <div style={{width: 300}}>
        <p className='day_text'>{text}</p>
        <Calendar className='day_calendar' onChange={onChange}/>
    </div>
  );
}