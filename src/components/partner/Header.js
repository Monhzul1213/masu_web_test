import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PlainRange } from '../all';

export function Header(props){
  const { size, onSearch } = props;
  const { t } = useTranslation();
  const [classH, setClassH] = useState('th_header1');
  const [date, setDate] = useState([moment().startOf('month'), moment()]);

  useEffect(() => {
    if(size?.width >= 870) setClassH('th_header1');
    else if(size?.width < 870 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    let query = '&BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    onSearch(query);
  }

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };

  return (
    <div className='ih_header' id={id} style={{paddingTop: 0}}>
      <div className={classH} style={{marginTop: 0}}>
        <PlainRange {...dateProps} />
      </div>
    </div>
  );
}