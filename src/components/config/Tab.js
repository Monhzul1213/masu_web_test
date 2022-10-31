import React from 'react';
import { Tabs } from 'antd';

import { Additional, Type, Cashier, Promo, Shop, Pos } from './tabs';

export function Tab(props){
  const { selectedKeys, setSelectedKeys } = props;

  const items = [
    { key: 'additional', children: <Additional /> },
    { key: 'type', children: <Type /> },
    { key: 'cashier', children: <Cashier /> },
    { key: 'promo', children: <Promo /> },
    { key: 'store', children: <Shop active={selectedKeys && selectedKeys[0]} /> },
    { key: 'pos', children: <Pos active={selectedKeys && selectedKeys[0]} setActive={setSelectedKeys} /> },
  ];

  return <Tabs activeKey={selectedKeys && selectedKeys[0]} defaultActiveKey='additional' items={items} />;
}