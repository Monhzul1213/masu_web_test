import React from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon } from './DynamicIcon';

export function Error(props){
  const { t } = useTranslation();
  const { error, label } = props;

  return (
    <div className='error_back' >
      <DynamicAIIcon name='AiOutlineInfoCircle' className='error_icon' />
      <span className='error_text'>{error ?? t(label)}</span>
    </div>
  )
}