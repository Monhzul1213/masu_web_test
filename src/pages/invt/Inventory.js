import React, { useState } from 'react';

import '../../css/invt.css';
import { Empty, Overlay } from '../../components/all';
import { List } from '../../components/invt/inventory';

export function Inventory(){
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const onClickAdd = () => {

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