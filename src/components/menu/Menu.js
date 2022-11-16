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
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const hideMenu = pathname?.includes('confirm');

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'fixed',
    left: 0,
    top: 'var(--header-height)',
    bottom: 0,
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = [
    getItem(t('menu.report'), '/report', <BsClipboardData />, [
      getItem(t('menu.report_sales'), '/report/report_sales'),
      getItem(t('menu.report_invtentory'), '/report/report_invtentory'),
      getItem(t('menu.report_category'), '/report/report_category'),
      getItem(t('menu.report_employee'), '/report/report_employee'),
      getItem(t('menu.report_payment'), '/report/report_payment'),
      getItem(t('menu.report_document'), '/report/report_document'),
      getItem(t('menu.report_edited'), '/report/report_edited'),
      getItem(t('menu.report_discount'), '/report/report_discount'),
      getItem(t('menu.report_noat'), '/report/report_noat'),
      getItem(t('menu.report_cashier'), '/report/report_cashier'),

    ]),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list'),
      getItem(t('menu.invt_category'), '/inventory/invt_category'),
      getItem(t('menu.invt_modi'), '/inventory/invt_modi'),
      getItem(t('menu.invt_discount'), '/inventory/invt_discount')
    ]),
    getItem(t('menu.management'), '/management', <TbBuildingWarehouse />),
    getItem(t('menu.employee'), '/employee', <RiContactsLine />, [
      getItem(t('menu.emp_list'), '/employee/emp_list'),
      getItem(t('menu.access_config'), '/employee/access_config'),
      getItem(t('menu.shift_config'), '/employee/shift_config'),
      getItem(t('menu.shift_list'), '/employee/shift_list'),
    ]),
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
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline' };

  return hideMenu ? null : (
    <Sider {...siderProps} width={300}>
      <Profile {...profileProps} />
      <AntMenu {...menuProps} />
    </Sider>
  )
}