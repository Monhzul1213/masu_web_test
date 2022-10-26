import React, { useState, useEffect } from 'react';

import '../../css/invt.css';
import { categories } from '../../helpers';
import { Empty, Overlay } from '../../components/all';
import { Add, List } from '../../components/invt/category';

export function Category(){
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(categories);
    return () => {};
  }, []);

  const onClickAdd = item => {
    setVisible(true);
    setSelected(item);
  }

  const closeModal = () => {
    setVisible(false);
    setSelected(null);
  }

  const addProps = { visible, closeModal, selected };
  const emptyProps = { icon: 'MdOutlineCategory', type: 'category', onClickAdd };
  const listProps = { data, onClickAdd };

  return (
    <div className='s_container'>
      {visible && <Add {...addProps} />}
      <Overlay loading={loading}>
        {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
      </Overlay>
    </div>
  );
}