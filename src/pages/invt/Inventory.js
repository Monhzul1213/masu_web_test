import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import { Empty, Overlay } from '../../components/all';
import { List } from '../../components/invt/inventory';

export function Inventory(){
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    setData([]);
    return () => {};
  }, []);

  const onClickAdd = () => {
    navigate('invt_add');
  }
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  // const listProps = { data, onClickAdd, onDelete, setLoading, setError, show, setShow, checked, setChecked, selected, setSelected };
  const listProps = { };

  return (
    <div className='s_container'>
      <Overlay loading={loading}>
        {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
      </Overlay>
    </div>
  )
}