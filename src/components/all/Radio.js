import React, { useState } from 'react';
import { Radio as AntRadio } from 'antd';

export function Radio(props){
  const { value, setValue, inRow, label, data } = props;

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div style={inRow ? { flex: 1 } : {}}>

    </div>
  );

  return (
    <AntRadio.Group onChange={onChange} value={value}>
      <AntRadio value={1}>A</AntRadio>
      <AntRadio value={2}>B</AntRadio>
      <AntRadio value={3}>C</AntRadio>
      <AntRadio value={4}>D</AntRadio>
    </AntRadio.Group>
  );
};