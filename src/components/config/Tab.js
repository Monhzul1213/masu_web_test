import React from 'react';
import { Tabs } from 'antd';

import { Additional, Type } from './tabs';

export function Tab(props){
  const { selectedKeys } = props;

  const items = [
    { key: 'additional', children: <Additional /> },
    { key: 'type', children: <Type /> },
  ];

  return <Tabs activeKey={selectedKeys && selectedKeys[0]} defaultActiveKey='additional' items={items} />;
}