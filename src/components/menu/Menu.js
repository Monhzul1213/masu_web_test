import React from 'react';
import { Layout, Menu as AntMenu } from 'antd';
import { RiUserSettingsLine } from 'react-icons/ri';
import { BsClipboardData, BsInboxes } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import '../../css/menu.css';
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

export function Menu(props){
  const { collapsed } = props;
  const { t } = useTranslation();

  const style = {
    overflow: 'auto',
    position: 'fixed',
    left: 0,
    top: 'var(--header-height)',
    bottom: 0,
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)'
  };
    // getItem(t('menu.profile'), '/profile', <RiUserSettingsLine />),

  const items = [
    getItem(t('menu.report'), '/report', <BsClipboardData />),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />),
    getItem(t('menu.management'), '/management', <BsInboxes />),
  ];

  /**
    "management": "Барааны менежмент",
    "employee": "Ажилтан",
    "customer": "Харилцагч",
    "integration": "Интеграци",
    "config": "Тохиргоо",
    "help": "Тусламж"
   */

  const onClick = e => {
    console.log(e);
  }

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style };

  return (
    <Sider {...siderProps} width={300}>
      <AntMenu items={items} onClick={onClick} />
    </Sider>
  )
}