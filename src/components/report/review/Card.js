import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';

import { colors } from '../../../helpers';
import { Money } from '../../all';

export function Card(props){
  const { data, size } = props;
  const [width, setWidth] = useState(210);

  useEffect(() => {
    let width = 250;
    if(size?.width >= 1290) width = calcWidth(1290, 5);
    else if(size?.width < 1290 && size?.width >= 1000) width = calcWidth(size?.width, 4);
    else if(size?.width < 1000 && size?.width >= 750) width = calcWidth(size?.width, 3);
    else if(size?.width < 750 && size?.width >= 500) width = calcWidth(size?.width, 2);
    else if(size?.width < 500) width = calcWidth(size?.width, 1);
    setWidth(width);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const calcWidth = (wid, num) => {
    return (wid - 30 - (num - 1) * 10) / num;
  }

  const Pop = ({ item }) => {
    return (
      <div>
        {item?.siteName}
      </div>
    );
  }

  const renderCard = (item, index) => {
    let color = colors && colors[index % 6 + 2];
    return (
      <Popover key={index} content={<Pop item={item} />} placement='bottom'>
        <div className='rw_card' style={{ width }}>
          <div className='rw_card_row'>
            <p className='rw_card_name'>{item?.siteName}</p>
            <p className='rw_card_count' style={{ color }}>{item?.salesCount}</p>
          </div>
          <p className='rw_card_amt'><Money value={item?.salesAmount} fontSize={18} /></p>
        </div>
      </Popover>
    );
  }

  return (
    <div className='rw_card_back'>
      {data?.map(renderCard)}
    </div>
  );
}