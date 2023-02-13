import React from 'react';
import { Modal } from 'antd';

export function Subscription(props){
  const { visible, setVisible } = props;

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={440}>
      <div>Subscription</div>
    </Modal>
  );
}