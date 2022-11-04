import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DynamicBSIcon, DynamicMDIcon, IconButton } from '../../../all';

export function CardEmpty(props){
  const { title, icon, route, btn } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickAdd = () => navigate(route);

  return (
    <div className='ac_back'>
      <p className='ac_title'>{t(title)}</p>
      <div className='ac_empty_back'>
        <DynamicMDIcon className='ac_empty_icon' name={icon} />
        <IconButton className='empty_btn' text={t(btn)} icon={<DynamicBSIcon name='BsPlusLg' className='em_icon' />} onClick={onClickAdd} />
      </div>
    </div>
  )
}