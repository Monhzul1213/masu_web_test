import React from 'react';
import { Layout, Menu as AntMenu } from 'antd';
import { RiUserSettingsLine, RiContactsLine, RiTeamLine } from 'react-icons/ri';
import { BsClipboardData, BsInboxes, BsPuzzle, BsGear, BsQuestionCircle } from 'react-icons/bs';
import { TbBuildingWarehouse } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../css/menu.css';
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

export function Menu(props){
  const { collapsed } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const style = {
    overflow: 'auto',
    position: 'fixed',
    left: 0,
    top: 'var(--header-height)',
    bottom: 0,
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)'
  };

  const items = [
    getItem(t('menu.report'), '/report', <BsClipboardData />),
    getItem(t('menu.inventory'), '/inventory', <BsInboxes />),
    getItem(t('menu.management'), '/management', <TbBuildingWarehouse />),
    getItem(t('menu.employee'), '/employee', <RiContactsLine />),
    getItem(t('menu.customer'), '/customer', <RiTeamLine />),
    getItem(t('menu.integration'), '/integration', <BsPuzzle />),
    getItem(t('menu.config'), '/config', <BsGear />),
    getItem(t('menu.help'), '/help', <BsQuestionCircle />),
  ];

  const onClick = e => navigate(e?.key);

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style };

  return (
    <Sider {...siderProps} width={300}>
      <AntMenu items={items} onClick={onClick} />
    </Sider>
  )
}