import React, { useState } from 'react';

import '../../css/invt.css';
import { Empty } from '../../components/all';
import { Add } from '../../components/invt/category';

export function Category(){
  const [visible, setVisible] = useState(false);

  const onClickAdd = () => setVisible(true);

  const closeModal = () => setVisible(false);

  const addProps = { visible, closeModal };
  const emptyProps = { icon: 'MdOutlineCategory', type: 'category' , onClickAdd };

  return (
    <div className='s_container'>
      {visible && <Add {...addProps} />}
      <Empty {...emptyProps} />
    </div>
  );
}