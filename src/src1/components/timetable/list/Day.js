import React, { useState } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';

export function Day(props){
//   const { view } = props;
  const [text, setText] = useState(moment()?.format('MMMM YYYY'));

  const onChange = (value) => {
    setText(value.format('MMMM YYYY'))
  };

  return ( 
    <div style={{width: 300}}>
        <p className='day_text'>{text}</p>
        <Calendar className='day_calendar' onChange={onChange}/>
    </div>
  );
}