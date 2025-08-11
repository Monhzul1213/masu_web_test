import React from 'react';

export function Title(props){
  const { title } = props;


  return (
    <div className='c_card_title_back'>
      <p className='c_card_title' style={{fontSize: 16, fontWeight: 500}}>{title}</p>
    </div>
  );
}