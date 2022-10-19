import React from 'react';
import { Tabs } from 'antd';

import { Additional } from './tabs';

export function Tab(props){
  const { selectedKeys } = props;
  const items = [
    { key: 'additional', children: <Additional /> },
  ];

  return <Tabs activeKey={selectedKeys && selectedKeys[0]} items={items} />;
}