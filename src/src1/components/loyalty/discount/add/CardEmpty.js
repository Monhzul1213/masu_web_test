import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DynamicBSIcon, DynamicMDIcon, IconButton } from '../../../all/all_m';

export function CardEmpty(props){
  const { title, icon, route, btn, id } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickAdd = () => navigate(route);

  return (
    <div className='ac_back' id={id}>
      <p className='ac_title_z'>{t(title)}</p>
      <div className='ac_empty_back_z'>
        <DynamicMDIcon className='ac_empty_icon_z' name={icon} />
        <IconButton className='empty_btn' text={t(btn)} icon={<DynamicBSIcon name='BsPlusLg' className='em_icon' />} onClick={onClickAdd} />
      </div>
    </div>
  )
}