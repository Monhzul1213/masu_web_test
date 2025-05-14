import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { Error1, Overlay} from '../../../components/all';
import moment from 'moment';

function Card(props){
  const { data, error, loading, getData} = props;
  const { t } = useTranslation();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item, index) => {

    return (
        <div key={index} className='noti_item_back'>
          <p className='noti_item_text1'>{moment(item?.createdDate)?.format('YYYY.MM.DD')}</p>
          <div>
            <p className='noti_item_text2'>{item?.subject}</p>
            <p className='noti_item_text3'>{item?.text}</p>
          </div>
        </div>
    )
  };

  return (
    <div className='store_tab' style={{maxHeight: 600, margin: '15px 10px'}}>
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