import React from 'react';
import { Tabs } from 'antd';

export function Tab(props){
  const { selectedKeys } = props;
  const items = [
    { key: 'additional', children: 'Content 1' },
  ];

  return <Tabs activeKey={selectedKeys && selectedKeys[0]} items={items} />;
}