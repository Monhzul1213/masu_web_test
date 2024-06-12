import React from 'react';

import { DynamicTBIcon, DynamicMDIcon } from './DynamicIcon';

export function ModalTitle(props){
  const { icon, title, isMD, className } = props;

  const iconProps = { className: 'm_title_icon', name: icon };

  return (
    <div className='m_title_row'>
      {!icon ? null : isMD ? <DynamicMDIcon {...iconProps} /> : <DynamicTBIcon {...iconProps} />}
      <p className={className ? className : 'm_title'}>{title}</p>
    </div>
  );
}