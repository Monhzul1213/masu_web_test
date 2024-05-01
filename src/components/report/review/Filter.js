import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect, TimeRange } from '../../all';

export function Filter(props){
  const { setError, size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment(), moment()]);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [time, TimeSelect] = useState([]);
  const [timeRange, setTimeRange] = useState(['00:00', '23:59']);
  const [classH, setClassH] = useState('rp_h_back1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    return () => {};
   
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('rp_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
  }, [size?.width]);

  const onHide = () => {
    let dateQuery = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(site?.length !== sites?.length) site?.forEach(item => dateQuery += '&SiteID=' + item);
    onSearch && onSearch(dateQuery, filter1, date);
    let timeQuery = '?BeginTime=' +time[0]?.format('00:00') + '&EndTime=' + time[1]?.format('23:00');
    if(site?.length !== sites?.length) site?.forEach(item => timeQuery += '&salesTime' + item);
    onSearch && onSearch (timeQuery,filter1, time);
}


  const onFocusSite = async () => {
    if(!sites?.length){
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        setSites(response?.data);
        setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const timeProps = {classBack: 'rp_time_back', label: t('time.select_time'), value: timeRange, setValue: setTimeRange, onHide: onHide, };
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.all_shop') };
  

  return (
    <div className={'rp_h_back1'}>
        <MonthRange {...dateProps} />
        <TimeRange {...timeProps}/>
        <MultiSelect {...siteProps} />
    </div>
  );
}
