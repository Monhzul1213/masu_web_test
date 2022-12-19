import React from 'react';
import { Tabs } from 'antd';

import { Type, Cashier, Promo, Shop, Pos, Tax, Document } from './tabs';

export function Tab(props){
  const { selectedKeys, setSelectedKeys } = props;

  const items = [
    { key: 'type', children: <Type /> },
    { key: 'cashier', children: <Cashier /> },
    { key: 'tax', children: <Tax /> },
    { key: 'document', children: <Document /> },
    { key: 'promo', children: <Promo /> },
    { key: 'store', children: <Shop active={selectedKeys && selectedKeys[0]} /> },
    { key: 'pos', children: <Pos active={selectedKeys && selectedKeys[0]} setActive={setSelectedKeys} /> },
  ];

  return <Tabs activeKey={selectedKeys && selectedKeys[0]} defaultActiveKey='additional' items={items} />;
}