import React, { useState } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import { monthCheck } from '../../../../helpers';

export function Day(props){
  const { onNavigate, value, setValue, onSearch } = props;
  const [text, setText] = useState((moment().format('YYYY') + ' оны ' +monthCheck(moment()?.format('MM'))));

  const onChange = (value) => {
    setText(value.format('YYYY') + ' оны ' +  monthCheck(value.format('MM')))
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