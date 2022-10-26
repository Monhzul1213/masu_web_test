import React from 'react';
import { Layout, Menu as AntMenu } from 'antd';
import { RiContactsLine, RiTeamLine } from 'react-icons/ri';
import { BsClipboardData, BsInboxes, BsPuzzle, BsGear, BsQuestionCircle } from 'react-icons/bs';
import { TbBuildingWarehouse } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../css/menu.css';
import { getItem } from '../../helpers';
import { Profile } from './Profile';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed, setCollapsed } = props;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const hideMenu = pathname?.includes('confirm');

  const style = {
    overflow: 'auto',
    position: 'fixed',
    left: 0,
    top: 'var(--header-height)',
    bottom: 0,
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = [
    getItem(t('menu.report'), '/report', <BsClipboardData />),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list'),
      getItem(t('menu.invt_category'), '/inventory/invt_category'),
      getItem(t('menu.invt_pack'), '/inventory/invt_pack'),
      getItem(t('menu.invt_discount'), '/inventory/invt_discount')
    ]),
    getItem(t('menu.management'), '/management', <TbBuildingWarehouse />),
    getItem(t('menu.employee'), '/employee', <RiContactsLine />),
    getItem(t('menu.customer'), '/customer', <RiTeamLine />),
    getItem(t('menu.integration'), '/integration', <BsPuzzle />),
    getItem(t('menu.config'), '/config', <BsGear />),
    getItem(t('menu.help'), '/help', <BsQuestionCircle />),
  ];

  const onClick = e => {
    navigate(e?.key);
    setCollapsed(true);
  }

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style };
  const profileProps = { collapsed, setCollapsed };
  // const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path], mode: 'inline' };
  const menuProps = { items, onClick, className: 'side_menu', defaultSelectedKeys: ['/' + path], mode: 'inline' };

  return hideMenu ? null : (
    <Sider {...siderProps} width={300}>
      <Profile {...profileProps} />
      <AntMenu {...menuProps} />
    </Sider>
  )
}