import React from 'react';
import { Drawer as AntDrawer } from 'antd';

export function Drawer(props){
  const { selected, setSelected } = props;

  const drawerProps = { placement: 'left', onClose: () => setSelected(null), closable: false, open: selected ? true : false };

  return (
    <AntDrawer {...drawerProps}>
    </AntDrawer>
  );
}