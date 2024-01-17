import React, { useState } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';

export function Day(props){
  const { onNavigate, value, setValue, onSearch } = props;
  const [text, setText] = useState(moment()?.format('MMMM YYYY'));

  const onChange = (value) => {
    setText(value.format('MMMM YYYY'))
    onNavigate(value.toDate(), 'Өдөр')
    setValue(value)
    let query = '?BeginDate=' + value?.format('yyyy.MM.DD') + '&EndDate=' +value?.format('yyyy.MM.DD');
    onSearch(query)
  };

  return ( 
    <div style={{width: 300}}>
        <p className='day_text'>{text}</p>
        <Calendar className='day_calendar' value={value} onChange={onChange}/>
    </div>
  );
}