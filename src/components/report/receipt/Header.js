import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PlainRange } from '../../all';

export function Header(props){
  const { onSearch } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    onSearch && onSearch(query);
  }

  const dateProps = { value: date, setValue: setDate, placeholder: t('time.select_date'), onHide, className: 'rp_date' };

  return (
    <div className='rp_h_back'>
      <PlainRange {...dateProps} />
    </div>
  );
}