import React from 'react';

import { DynamicTBIcon } from './DynamicIcon';

export function ModalTitle(props){
  const { icon, title } = props;

  return (
    <div className='m_title_row'>
      <DynamicTBIcon className='m_title_icon' name={icon} />
      <p className='m_title'>{title}</p>
    </div>
  );
}