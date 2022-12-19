import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';

import { ButtonRowAdd, Overlay } from '../../components/all';
import { PayModal } from '../../components/config/cashier';

export function Cashier(){
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(null);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      { label: 'Бэлэн мөнгө', value: 'Бэлэн мөнгө' },
      { label: 'Банкны карт', value: 'Банкны карт' },
      { label: 'Онлайн гүйлгээ', value: 'Онлайн гүйлгээ', disabled: true },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const closeModal = () => setVisible(null);
  
  const onClickAdd = () => setVisible('pay');

  const onClickDelete = () => {
    setTimeout(() => setLoading(false), 1200);
  };

  const onChange = values => {
    setChecked(values);
    setShow(values?.length ? true : false);
  };
  
  const payProps = { visible: visible === 'pay', closeModal };
  const addProps = { type: 'cashier', onClickAdd, show, onClickDelete };

  return (
    <Overlay className='cash_tab' loading={loading}>
      {visible === 'pay' && <PayModal {...payProps} />}
      <div style={{padding: 15}}>
        <ButtonRowAdd {...addProps} />
      </div>
      <div className='ca_tab_back'>
        <Checkbox.Group
          className='ca_check'
          value={checked}
          options={data}
          onChange={onChange} />
      </div>
    </Overlay>
  )
}