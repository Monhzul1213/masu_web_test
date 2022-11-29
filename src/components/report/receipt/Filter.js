import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { MonthRange } from '../../all';

export function Filter(props){
  const { onSearch } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    console.log(query);
    // onSearch && onSearch(query);
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };

  return (
    <div className='rp_h_back'>
      <MonthRange {...dateProps} />
    </div>
  );
}