import React, { useEffect, useState } from 'react';
import { Layout, Menu as AntMenu, Drawer } from 'antd';
import { RiContactsLine, RiTeamLine } from 'react-icons/ri';
import { BsClipboardData, BsInboxes, BsPuzzle, BsGear, BsQuestionCircle } from 'react-icons/bs';
import { TbBuildingWarehouse } from 'react-icons/tb';
import { FiTool } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../../css/menu.css';
import { getItem } from '../../helpers';
import { Profile } from './Profile';
import { Install } from './Install';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed, setCollapsed, size } = props;
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);
  const [hideConfig, setHideConfig] = useState(true);
  const { pathname } = useLocation();
  const { user: { msRole, isAdmin }, isPartner } = useSelector(state => state.login);
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order'));
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setCollapsed(size?.width > 740 ? false : true);
    if(isAdmin) setOpenKeys(["system", "/system"]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let width = (size?.width ?? 1500) - 30 - (collapsed ? 72 : 300);
    setHideConfig(width >= 1000);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, collapsed]);

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = isPartner ? [
    getItem(t('menu.partner'), '/partner', <RiTeamLine />),
  ] : isAdmin ? [
    getItem(t('menu.system'), '/system', <FiTool />, [
      getItem(t('menu.solve'), '/system/request_solve'),
      getItem(t('menu.invoice'), '/system/invoice'),
      getItem(t('menu.info'), '/system/info'),
      getItem(t('menu.system_partner'), '/system/partner'),
      getItem(t('menu.advert'), '/system/advert'),
      getItem(t('menu.noti'), '/system/notification'),
    ])
  ] : [
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
      getItem(t('menu.report_order'), '/report/report_orList', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.terms'), '/report/terms', null, null, null, msRole?.webViewSalesReport !== 'Y'),
    ]),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_category'), '/inventory/invt_category', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_modi'), '/inventory/invt_modi', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_discount'), '/inventory/invt_discount', null, null, null, msRole?.webManageItem !== 'Y')
    ]),
    getItem(t('menu.management'), '/management', <TbBuildingWarehouse />,[
      getItem(t('menu.suppliers'), '/management/suppliers', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.order_list'), '/management/order_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_remainder'), '/management/invt_remainder', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_txn'), '/management/invt_txn', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.adjust'), '/management/adjust', null, null, null, msRole?.webManageItem !== 'Y')
    ]),
    getItem(t('menu.employee'), '/employee', <RiContactsLine />, [
      getItem(t('menu.emp_list'), '/employee/emp_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.access_config'), '/employee/access_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_config'), '/employee/shift_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_list'), '/employee/shift_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
    ]),
    getItem(t('menu.customer'), '/customer', <RiTeamLine />, null, null, msRole?.webManageCustomer !== 'Y'),
    getItem(t('menu.integration'), '/integration', <BsPuzzle />, null, null, msRole?.webManageCustomer !== 'Y'),
    hideConfig ? getItem(t('menu.config'), '/config/additional', <BsGear />, null, null, msRole?.webEditSettings !== 'Y') :
    getItem(t('menu.config'), '/config', <BsGear />, [
      getItem(t('system_menu.additional'), '/config/additional', null, null, null, msRole?.webEditSettings !== 'Y'),
      // getItem(t('system_menu.type'), '/config/type', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.cashier'), '/config/cashier', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.tax'), '/config/tax', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.document'), '/config/document', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.store'), '/config/store', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.pos'), '/config/pos', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.order_location'), '/config/location', null, null, null, msRole?.webEditSettings !== 'Y'),
    ]),
    getItem(t('menu.help'), '/help', <BsQuestionCircle />),
  ];

  const onClick = (e, hide) => {
    if(e?.key === '/help') window.open("https://help.masu.mn");
    else navigate(e?.key);
    if(hide) setCollapsed(true);
  }

  const rootSubmenuKeys = ['/report', '/inventory', '/management', '/employee', '/customer', '/integration', '/config', '/help'];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style, breakpoint: 'lg', width: 300,
    onCollapse: setCollapsed };
  const drawerProps = { className: 'menu_drawer', placement: 'left', onClose: () => setCollapsed(true), closable: false, open: !collapsed };
  const profileProps = { collapsed, setCollapsed };
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline', openKeys, onOpenChange };
  const menu1Props = { items, onClick: e => onClick(e, true), className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline' };

  return hideMenu ? null : (
    <>
      <Sider {...siderProps}>
        <div className='mi_top'>
          <Profile {...profileProps} />
          <AntMenu {...menuProps} />
        </div>
        {!isPartner && <Install {...profileProps} />}
      </Sider>
      <Drawer {...drawerProps}>
        <div className='mi_top'>
          <Profile {...profileProps} />
          <AntMenu {...menu1Props} />
        </div>
        {!isPartner && <Install {...profileProps} />}
      </Drawer>
    </>
  )
}