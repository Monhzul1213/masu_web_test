import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DynamicAIIcon, MonthRange, PlainSelect } from '../../../../../components/all';

export function Filter(props){
  const { size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState(3);
  const [classH, setClassH] = useState('rp_h_back1');

  useEffect(() => {
    onFocusType();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('rp_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(type?.length !== types?.length) type?.forEach(item => query += '&SiteID=' + item);
    onSearch && onSearch(query, filter1, date);
  }

  const onFocusType = async () => {
    if(!types?.length || types?.length === 1){
      setTypes([
        { value: 0, label: 'Гүйлгээ баланс' },
        { value: 1, label: 'Дансны хуулга' },
        { value: 2, label: 'Ерөнхий дэвтэр' },
        { value: 3, label: 'Ерөнхий журнал' },
        { value: 4, label: 'Ажлын хүснэгт' }
      ]);
    }
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };

  const siteProps = { value: type, setValue: setType, data: types, s_value: 'value', s_descr: 'label', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [0, 5] },
    onFocus: onFocusType, placeholder: t('time.select_shop') };
  
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <PlainSelect {...siteProps} />
      </div>
    </div>
  );
}