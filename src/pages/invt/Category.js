import React, { useState } from 'react';

import '../../css/invt.css';
import { Empty } from '../../components/all';
import { Add, List } from '../../components/invt/category';

export function Category(){
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const onClickAdd = () => setVisible(true);

  const closeModal = () => setVisible(false);

  const addProps = { visible, closeModal };
  const emptyProps = { icon: 'MdOutlineCategory', type: 'category' , onClickAdd };

  return (
    <div className='s_container'>
      {visible && <Add {...addProps} />}
      {data?.length ? <List /> : <Empty {...emptyProps} />}
    </div>
  );
}