import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from './Button';
import { DynamicBSIcon, DynamicMDIcon } from './DynamicIcon';

export function Empty(props){
  const { icon, type, onClickAdd, noDescr } = props;
  const { t } = useTranslation();

  return (
    <div className='empty_back'>
      <div className='empty_icon_back'>
        <DynamicMDIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_title'>{t(type + '.title')}</p>
      <p className='empty_descr'>{noDescr ? '' : t(type + '.descr')}</p>
      <IconButton className='empty_btn' text={t(type + '.add')} icon={<DynamicBSIcon name='BsPlusLg' className='em_icon' />}
        onClick={() => onClickAdd()} />
    </div>
  )
}

export function Empty1(props){
  const { icon, noDescr } = props;
  const { t } = useTranslation();

  return (
    <div className='empty_back1'>
      <div className='empty_icon_back'>
        <DynamicMDIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_descr'>{noDescr ? '' : t('page.no_filter')}</p>
    </div>
  )
}