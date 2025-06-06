import React, { useEffect, useState } from 'react';
import { Layout, Menu as AntMenu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/menu.css';
import { getList } from '../../services';
import { getItem } from '../../helpers';
import { Profile1 } from './Profile';
import { Install } from './Install';
import { Rating } from './Rating';
import { control, image1, image10, image11, image12, image13, image14, image2, image3, image4, image6, image7, image8, image9 } from '../../assets';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed, setCollapsed, size } = props;
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);
  const [hideConfig, setHideConfig] = useState(true);
  const [hideTime, setHideTime] = useState(true);
  const [hideMenu, setHideMenu] = useState(false);
  const [review, setReview] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(false);
  const { user: { msRole, isAdmin }, isPartner, user, token } = useSelector(state => state.login);
  const { pathname } = useLocation();
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order')) 
    || pathname1?.includes('statement') || pathname1?.includes('inv_pdf') || pathname1?.includes('tax_pdf') || pathname1?.includes('sales_pdf');
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setCollapsed(size?.width > 740 ? false : true);
    if(isAdmin) setOpenKeys(["system", "/system"]);

    getReview();
    getConfig();

    if (
      user?.merchantId === 66 ||
      user?.merchantId === 135 ||
      user?.merchantId === 383 ||
      user?.merchantId === 631 ||
      user?.merchantId === 270 ||
      user?.merchantId === 164 ||
      user?.merchantId === 700 ||
      user?.merchantId === 724 ||
      user?.merchantId === 999 ||
      user?.merchantId === 1226
    )
      setHideTime(false);
    else
      setHideTime(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let width = (size?.width ?? 1500) - 30 - (collapsed ? 72 : 300);
    setHideConfig(width >= 1000);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, collapsed]);

  const getReview = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetReviewItem'));
    const review = response?.data?.filter(item => item.isShow !== 'Y')[0];
    setReview(review);
  }

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setSubscriptionType(response?.data?.subscriptionType)
  }

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = isPartner ? [
    getItem(t('menu.partner'), '/partner', <img src={image13} alt='image13'/>),
  ] : isAdmin ? [
    getItem(t('menu.system'), '/system', <img src={image14} alt='image14'/>, [
      getItem(t('menu.solve'), '/system/request_solve'),
      getItem(t('menu.invoice'), '/system/invoice'),
      getItem(t('menu.info'), '/system/info'),
      getItem(t('menu.system_partner'), '/system/partner'),
      getItem(t('menu.advert'), '/system/advert'),
      getItem(t('menu.noti'), '/system/notification'),
      getItem(t('menu.rating'), '/system/rating')
    ])
  ] : [
    // getItem(t('menu.control'), '/', <img src={control} alt='image9' />, null, null, msRole?.webManageItem !== 'Y'),
    getItem(t('menu.report'), '/report', <img src={image6} alt='image6' />, [
      getItem(t('menu.report_sales'), '/report/report_sales', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_inventory'), '/report/report_inventory', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_category'), '/report/report_category', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_employee'), '/report/report_employee', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_payment'), '/report/report_payment', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_document'), '/report/report_document', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_order'), '/report/report_orList', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_buyer'), '/report/report_buyer', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_time'), '/report/report_time', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_edited'), '/report/report_edited', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_discount'), '/report/report_discount', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_noat'), '/report/report_noat', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_receivable'), '/report/report_receivable', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.report_cashier'), '/report/report_cashier', null, null, null, msRole?.webViewSalesReport !== 'Y'),
      getItem(t('menu.terms'), '/report/terms', null, null, null, msRole?.webViewSalesReport !== 'Y'),
    ]),
    getItem(t('menu.inventory'), '/inventory', <img src={image3} alt='image3' />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_category'), '/inventory/invt_category', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_modi'), '/inventory/invt_modi', null, null, null, msRole?.webManageItem !== 'Y'),
    ]),
     getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.management')}</span> : t('menu.management'), '/management', 
     <img src={image4} alt='image4' />,[
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.suppliers')}</span> : t('menu.suppliers'), '/management/suppliers', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.invt_remainder')}</span> : t('menu.invt_remainder'), '/management/invt_remainder', null, null, null, msRole?.webViewItemBalance !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.invt_txn')}</span> : t('menu.invt_txn'), '/management/invt_txn', null, null, null, msRole?.webViewItemBalance !== 'Y'),
      {type: 'divider'},
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.order_list')}</span> : t('menu.order_list'), '/management/order_list', null, null, null, msRole?.webIsReceipt !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.adjust')}</span> : t('menu.adjust'), '/management/adjust', null, null, null, msRole?.webIsAdjust !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.transfer')}</span> : t('menu.transfer'), '/management/transfer', null, null, null, msRole?.webIsTransfer !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.count')}</span> : t('menu.count'), '/management/count', null, null, null, msRole?.webIsPicount !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.package')}</span> : t('menu.package'), '/management/package', null, null, null, msRole?.webIsAssembly !== 'Y')
    ]),
    getItem(t('menu.employee'), '/employee', <img src={image1} alt='image1' />, [
      getItem(t('menu.emp_list'), '/employee/emp_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.access_config'), '/employee/access_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_config'), '/employee/shift_config', null, null, null, msRole?.webManageEmployy !== 'Y'),
      getItem(t('menu.shift_list'), '/employee/shift_list', null, null, null, msRole?.webManageEmployy !== 'Y'),
    ]),
    getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.customer')}</span> : t('menu.customer'), '/customer', 
    <img src={image2} alt='image2'/>, [
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.customer')}</span> : t('menu.customer'), '/customer/customer', null, null, null, msRole?.webManageCustomer !== 'Y'),
      getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.customer_type')}</span> : t('menu.customer_type'), '/customer/customer_type', null, null, null, msRole?.webManageCustomer !== 'Y'),

    ]),
    getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.loyalty')}</span> : t('menu.loyalty'), '/loyalty', 
    <img src={image7} alt='image7' />, [
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.coupon')}</span> : t('menu.coupon'), '/loyalty/coupon', null, null, null, msRole?.webManageLoyalty !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.voucher')}</span> : t('menu.voucher'), '/loyalty/voucher', null, null, null, msRole?.webManageLoyalty !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.invt_discount')}</span> : t('menu.invt_discount'), '/inventory/invt_discount', null, null, null, msRole?.webManageLoyalty !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.bonus')}</span> : t('menu.bonus'), '/loyalty/bonus', null, null, null, msRole?.webManageLoyalty !== 'Y'),
      getItem(subscriptionType !== 'STANDARD' && subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.giftCard')}</span> : t("menu.giftCard"), "/loyalty/giftCard", null, null, null, msRole?.webManageLoyalty !== "Y")
    ]),
    hideTime ? null : getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('timetable.time')}</span> : t('timetable.time'), '/timetable', 
    <img src={image8} alt='image8' />, [
      getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.timetable')}</span> : t('menu.timetable'), '/timetable/timeschedule', null, null, null, msRole?.webAppointment !== 'Y'),
      getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.service')}</span> : t('menu.service'), '/timetable/service', null, null, null, msRole?.webAppointment !== 'Y'),
    ]),
    hideTime ? null : getItem(subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("transModel.finance")}</span>) : (t("transModel.finance")), "/finance",
    <img src={image12} alt='image12' />,[
        getItem( subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("account.title")}</span>) : (t("account.title")), "/finance/account", null, null, null, msRole?.webFinance !== "Y"),
        getItem( subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("transModel.title")}</span>) : (t("transModel.title")), "/finance/template", null, null, null,msRole?.webFinance !== "Y"),
        getItem( subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("transModel.journal")}</span>) : (t("transModel.journal")), "/finance/journal", null, null, null,msRole?.webFinance !== "Y"),
        getItem( subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("transModel.report")}</span>) : (t("transModel.report")), "/finance/report", <div className='gap'/>, 
        [
          getItem( subscriptionType !== "PREMIUM" ? (<span style={{ color: "#969696" }}>{t("transModel.generel_journal")}</span>) : (t("transModel.generel_journal")), "/finance/report/generel_journal", null, null, null,msRole?.webFinance !== "Y")
        ])
    ]),
    getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('menu.integration')}</span> : t('menu.integration'), '/integration', 
    <img src={image9} alt='image9' />, null, null, msRole?.webManageCustomer !== 'Y'),
    hideConfig ? getItem(t('menu.config'), '/config/additional', <img src={image10} alt='image10'/>, null, null, msRole?.webEditSettings !== 'Y') :
    getItem(t('menu.config'), '/config', <img src={image10} alt='image10'/>, [
      getItem(t('system_menu.additional'), '/config/additional', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.cashier'), '/config/cashier', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.tax'), '/config/tax', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.document'), '/config/document', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.type'), '/config/type', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(t('system_menu.store'), '/config/store', null, null, null, msRole?.webManageSite !== 'Y'),
      getItem(t('system_menu.pos'), '/config/pos', null, null, null, msRole?.webManagePos !== 'Y'),
      getItem(t('system_menu.order_location'), '/config/location', null, null, null, msRole?.webEditSettings !== 'Y'),
      getItem(subscriptionType !== 'PREMIUM' ? <span style={{color: '#969696'}}>{t('system_menu.reclam')}</span> : t('system_menu.reclam'), '/config/reclam', null, null, null, msRole?.webEditSettings !== 'Y')

    ]),
    getItem(t('menu.help'), '/help', <img src={image11} alt='image11' />),
  ];

  const onClick = (e, hide) => {
    if(e?.key === '/help') window.open("https://help.masu.mn");
    else navigate(e?.key);
    if(hide) setCollapsed(true);
  }

  const rootSubmenuKeys = ['/report', '/inventory', '/management', '/employee', '/customer', '/loyalty', '/timetable', '/integration', '/config', '/help'];

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
  // const drawerProps = { className: 'menu_drawer', placement: 'left', onClose: () => setCollapsed(true), closable: false, open: !collapsed };
  const profileProps = { collapsed, setCollapsed, subscriptionType };
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline', openKeys, onOpenChange };
  // const menu1Props = { items, onClick: e => onClick(e, true), className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline' };
  const rateProps = { review, setReview };

  return hideMenu ? null : (
    <>
      <Rating {...rateProps} />
      <Sider {...siderProps}>
        <Profile1 {...profileProps} />
        <div className='mi_top'>
          <AntMenu {...menuProps} />
        </div>
        {!isPartner && <Install {...profileProps} />}
      </Sider>
      {/* <Drawer {...drawerProps}>
        <div className='mi_top'>
          <AntMenu {...menu1Props} />
        </div>
        {!isPartner && <Install {...profileProps} />}
      </Drawer> */}
    </>
  )
}
