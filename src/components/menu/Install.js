import React from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

export function Install(props){
  const { collapsed } = props;
  const { t } = useTranslation();

  const onClick = () => {};
  
  return (
    <button className='mi_btn' onClick={onClick}>
      <AiOutlineAppstore className='mi_icon' />
      {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
    </button>
  );
}