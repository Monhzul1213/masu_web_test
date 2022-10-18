import React from 'react';
import { Layout } from 'antd';

import '../../css/menu.css';
const { Sider } = Layout;

export function Menu(props){
  const { collapsed } = props;

  const style = {
    overflow: 'auto',
    position: 'fixed',
    left: 0,
    top: 'var(--header-height)',
    bottom: 0,
    backgroundColor: 'var(--side-color)',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)'
  };

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style };

  return (
    <Sider {...siderProps}>
      Menu
    </Sider>
  )
}