import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';

import { Overlay, ButtonRowAdd } from '../../all';
import { PayModal } from './cashiers';

export function Cashier(){
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    setData([
      { label: 'Бэлэн мөнгө', value: 'Бэлэн мөнгө' },
      { label: 'Банкны карт', value: 'Банкны карт' },
      { label: 'Онлайн гүйлгээ', value: 'Онлайн гүйлгээ', disabled: true },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickAdd = () => setVisible('pay');
  
  const onClickDelete = () => {
    // setLoading(true);
    console.log('onClickDelete');
    setTimeout(() => setLoading(false), 1200);
  };

  const onChange = values => {
    setChecked(values);
    setShow(values?.length ? true : false);
  };

  const closeModal = () => setVisible(null);

  const payProps = { visible: visible === 'pay', closeModal };
  const addProps = { type: 'cashier', onClickAdd, show, onClickDelete };

  return (
    <Overlay className='c_tab_cont' loading={loading}>
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
  );
}