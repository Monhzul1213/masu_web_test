import React from 'react';
import { DynamicBSIcon } from '../../all/DynamicIcon';

export function Title(props){
  const { title, sub_title, icon, color } = props;

  let style = color ? {backgroundColor: color} : {};

  return (
    <div className='c_card_title_back'>
      <div className='c_card_title_ic' style={style}>
        <DynamicBSIcon className='c_card_title_icon' name={icon} />
      </div>
      <div className='c_card_title_side'>
        <p className='c_card_title'>{title}</p>
        <p className='c_card_title_sub'>{sub_title}</p>
      </div>
    </div>
  );
}