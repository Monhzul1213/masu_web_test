import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DynamicAIIcon, MonthRange, MultiSelect, TimeRange } from '../../all';

export function Filter(props){
  const { onSearch } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [time, setTime] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    console.log(query);
    onSearch && onSearch(query);
  }

  const onFocusSite = () => {
    setLoading('sites');
    setSites([]);
    setTimeout(() => setLoading(null), 300);
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const timeProps = { value: time, setValue: setTime, onHide, classBack: 'rp_time_back', label: t('report_receipt.all_day') };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };

  return (
    <div className='rp_h_back'>
      <MonthRange {...dateProps} />
      <TimeRange {...timeProps} />
      <MultiSelect {...siteProps} />
    </div>
  );
}