import React from 'react';

import '../../css/invt.css';
import { Empty } from '../../components/all';

export function Category(){

  const onClickAdd = () => {
    console.log('onClickAdd');
  }

  const emptyProps = { icon: 'MdOutlineCategory', type: 'category' , onClickAdd };

  return (
    <div className='s_container'>
      <Empty {...emptyProps} />
    </div>
  );
}