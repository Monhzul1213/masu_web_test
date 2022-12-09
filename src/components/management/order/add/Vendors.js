import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';

import '../../../../css/order.css';
import { placeholder } from '../../../../assets';

export function Vendors(props){
  const { size, data } = props;
  const [width, setWidth] = useState(300);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(size?.width >= 1275) setWidth(300);
    else if(size?.width >= 1050 && size?.width < 1275) setWidth(Math.floor((size?.width - 75) / 4));
    else if(size?.width >= 795 && size?.width < 1050) setWidth(Math.floor((size?.width - 60) / 3));
    else setWidth(Math.floor((size?.width - 45) / 2));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onClick = item => {
    let pathname = searchParams?.get('next')
    navigate({ pathname, search: createSearchParams({ vendId: item?.vendId }).toString() });
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