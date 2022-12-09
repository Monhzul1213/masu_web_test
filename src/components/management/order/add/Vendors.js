import React, { useState, useEffect } from 'react';

import '../../../../css/order.css';
import { placeholder } from '../../../../assets';

export function Vendors(props){
  const { size, data } = props;
  const [width, setWidth] = useState(300);

  useEffect(() => {
    if(size?.width >= 1270) setWidth(300);
    else if(size?.width >= 1030 && size?.width < 1270) setWidth((size?.width - 60) / 4);
    else if(size?.width >= 780 && size?.width < 1030) setWidth((size?.width - 50) / 3);
    else setWidth((size?.width - 40) / 2);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onClick = item => {
    console.log(item);
  }

  const renderItem = (item, index) => {
    return (
      <button key={index} className='po_vend_btn' style={{ width }} onClick={() => onClick(item)}>
        <img src={placeholder} className='po_vend_logo' alt={item?.vendName} />
        <p className='po_vend_title'>{item?.vendName}</p>
      </button>
    )
  }

  return (
    <div className='po_vend_back'>
      {data?.map(renderItem)}
    </div>
  )
}