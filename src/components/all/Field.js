import React from 'react';

export function Field(props){
  const { value, label, inRow, classBack, className } = props;

  const style = inRow ? { flex: 1 } : {};
  const backStyle = inRow ? { margin: '0 0 0 0' } : {};

  return (
    <div style={style}>
      <div className={classBack ?? 'select_back'} style={backStyle}>
        {label && <p className='select_lbl'>{label}</p>}
        <p className={className ?? 'm_field'}>{value}</p>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  )
}