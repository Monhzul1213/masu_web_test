import React from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { getItem } from '../../../helpers';
import { Title } from './Title';

export function Card(){
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname?.split('/') && pathname?.split('/')[2];

  const items = [
    getItem(t('system_menu.additional'), 'additional'),
    getItem(t('system_menu.type'), 'type'),
    getItem(t('system_menu.cashier'), 'cashier'),
    getItem(t('system_menu.tax'), 'tax'),
    getItem(t('system_menu.document'), 'document'),
  ];

  const items1 = [
    getItem(t('system_menu.store'), 'store'),
    getItem(t('system_menu.pos'), 'pos'),
  ];

  const onClick = e => navigate(e?.key);

  const sTitleProps = { title: t('config.config'), sub_title: t('config.system_config'), icon: 'BsGear' };
  const sMenuProps = { items, onClick, className: 'system_menu', selectedKeys: [path] };
  const pTitleProps = { title: t('config.store'), sub_title: t('config.store_config'), icon: 'BsShop', color: '#a020f0cc' };
  const pMenuProps = { items: items1, onClick, className: 'system_menu', selectedKeys: [path] };

  return (
    <div className='c_card_back'>
      <Title {...sTitleProps} />
      <Menu {...sMenuProps} />
      <Title {...pTitleProps} />
      <Menu {...pMenuProps} />
    </div>
  );
}