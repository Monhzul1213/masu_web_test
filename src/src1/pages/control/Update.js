import React, {useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';
import { Overlay } from '../../../components/all';
import moment from 'moment';

function Card(props) {
  const { updateData, loading, getData, size } = props;
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 870) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 49px - 10px - 37px)');
    else if(size?.width < 870 && size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 113px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 162px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const renderItem = (item, index) => {
    const date = moment(item?.verisionDate).format('YYYY.MM.DD');
    let fillColor = '#4baf4f', color= 'transparent';

    return (
      <div key={date} className='up_back'>
        <div className='up_item_date_wrap'>
          <div className='dot' style={{backgroundColor: item?.show ? color : fillColor}}/>
          <p className='up_item_text1'>{date}</p>
        </div>
        <div key={index} className='up_item_back'>
          <p className='up_item_text2'>{item?.versionTitle}</p>
          <p className='up_item_text3' style={{ whiteSpace: 'pre-line' }}>{item?.versionDescr}</p>
        </div>
      </div>
    )
  };
  return (
    <div className='store_tab' style={{maxHeight, margin: '10px 10px'}} id='list_scroll'>
      <Overlay loading={loading}>
        {updateData?.map(renderItem)}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Update = withSizeHOC(Card);
