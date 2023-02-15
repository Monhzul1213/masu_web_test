import React from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

export function Install(props){
  const { collapsed } = props;
  const { t } = useTranslation();

  return (
    <a className='mi_btn' href='https://app.masu.mn/files/MasuInstaller.exe' download='MasuInstaller.exe'>
      <AiOutlineAppstore className='mi_icon' />
      {!collapsed && <p className='mi_text'>{t('menu.install')}</p>}
    </a>
  );
}