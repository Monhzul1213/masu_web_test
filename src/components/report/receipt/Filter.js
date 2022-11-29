import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { MonthRange, TimeRange } from '../../all';

export function Filter(props){
  const { onSearch } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [time, setTime] = useState(null);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    console.log(query);
    // onSearch && onSearch(query);
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const timeProps = { value: time, setValue: setTime, onHide, classBack: 'rp_time_back', label: t('report_receipt.all_day') };

  return (
    <div className='rp_h_back'>
      <MonthRange {...dateProps} />
      <TimeRange {...timeProps} />
    </div>
  );
}