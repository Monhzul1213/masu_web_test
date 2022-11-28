import React, { useEffect } from 'react';
import { Layout, Menu as AntMenu, Drawer } from 'antd';
import { RiContactsLine, RiTeamLine } from 'react-icons/ri';
import { BsClipboardData, BsInboxes, BsPuzzle, BsGear, BsQuestionCircle } from 'react-icons/bs';
import { TbBuildingWarehouse } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../../css/menu.css';
import { getItem } from '../../helpers';
import { Profile } from './Profile';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed, setCollapsed } = props;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user: { msRole } } = useSelector(state => state.login);
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const hideMenu = pathname?.includes('confirm');

  useEffect(() => {
    setCollapsed(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = [
    getItem(t('menu.report'), '/report', <BsClipboardData />, [
      getItem(t('menu.report_sales'), '/report/report_sales', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_invtentory'), '/report/report_invtentory', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_category'), '/report/report_category', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_employee'), '/report/report_employee', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_payment'), '/report/report_payment', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_document'), '/report/report_document', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_edited'), '/report/report_edited', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_discount'), '/report/report_discount', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_noat'), '/report/report_noat', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_cashier'), '/report/report_cashier', null, null, null, msRole?.webViewSalesReport !== 'Y'),
    ]),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_category'), '/inventory/invt_category', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_modi'), '/inventory/invt_modi', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_discount'), '/inventory/invt_discount', null, null, null, msRole?.webManageItem !== 'Y')
    ]),
    getItem(t('menu.management'), '/management', <TbBuildingWarehouse />),
    getItem(t('menu.employee'), '/employee', <RiContactsLine />, [
      getItem(t('menu.emp_list'), '/employee/emp_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.access_config'), '/employee/access_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_config'), '/employee/shift_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_list'), '/employee/shift_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
    ]),
    getItem(t('menu.customer'), '/customer', <RiTeamLine />, null, null, msRole?.webManageCustomer !== 'Y'),
    getItem(t('menu.integration'), '/integration', <BsPuzzle />),
    getItem(t('menu.config'), '/config', <BsGear />),
    getItem(t('menu.help'), '/help', <BsQuestionCircle />),
  ];

  const onClick = (e, hide) => {
    navigate(e?.key);
    if(hide) setCollapsed(true);
  }

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style, breakpoint: 'lg', width: 300,
    onCollapse: setCollapsed };
  const drawerProps = { placement: 'left', onClose: () => setCollapsed(true), closable: false, open: !collapsed };
  const profileProps = { collapsed, setCollapsed };
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline' };
  const menu1Props = { items, onClick: e => onClick(e, true), className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline' };

  return hideMenu ? null : (
    <>
      <Sider {...siderProps}>
        <Profile {...profileProps} />
        <AntMenu {...menuProps} />
      </Sider>
      <Drawer {...drawerProps}>
        <Profile {...profileProps} />
        <AntMenu {...menu1Props} />
      </Drawer>
    </>
  )
}