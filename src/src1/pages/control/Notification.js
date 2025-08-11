import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';

import { Error1, Overlay} from '../../../components/all';
import moment from 'moment';

function Card(props){
  const { data, size, error, loading, getData} = props;
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

    return (
        <div key={index} className='noti_item_back'>
          <p className='noti_item_text1'>{moment(item?.createdDate)?.format('YYYY.MM.DD')}</p>
          <div>
            <p className='noti_item_text2'>{item?.subject}</p>
            <div className='noti_item_text3' dangerouslySetInnerHTML={{ __html: item?.text || '' }}/>
          </div>
        </div>
    )
  };

  return (
    <div className='store_tab' style={{maxHeight, margin: '15px 10px'}}>
      {/* <Prompt edited={edited} /> */}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {data?.map(renderItem)}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Notification = withSizeHOC(Card);