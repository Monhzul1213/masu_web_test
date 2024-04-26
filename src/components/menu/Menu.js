import React, { useEffect, useState } from 'react';
import { Layout, Menu as AntMenu, Drawer } from 'antd';
import { RiTeamLine } from 'react-icons/ri';
import { BsClipboardData } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/menu.css';
import { getList } from '../../services';
import { getItem } from '../../helpers';
import { Profile } from './Profile';
import { Install } from './Install';
import { Rating } from './Rating';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed, setCollapsed, size } = props;
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);
  const [hideMenu, setHideMenu] = useState(false);
  const [review, setReview] = useState(false);
  const { user: { msRole, isAdmin }, isPartner, user, token } = useSelector(state => state.login);
  const { pathname } = useLocation();
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order')) || pathname1?.includes('statement');
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setCollapsed(size?.width > 740 ? false : true);
    if(isAdmin) setOpenKeys(["system", "/system"]);

    getReview();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReview = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetReviewItem'));
    const review = response?.data?.filter(item => item.isShow !== 'Y')[0];
    setReview(review);
  }

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const items = isPartner ? [
    getItem(t('menu.partner'), '/partner', <RiTeamLine />),
  ] : [
    getItem(t('menu.report'), '/report', <BsClipboardData />, [
      getItem(t('menu.report_buyer'), '/report/report_buyer', null, null, null, msRole?.webViewSalesReport !== 'Y')
    ])
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
  const rateProps = { review, setReview };

  return hideMenu ? null : (
    <>
      <Rating {...rateProps} />
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