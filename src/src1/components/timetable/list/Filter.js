import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import '../../../css/timetable.css'
import { MonthRange, PlainSelect } from '../../../components/all/all_m';
import { week } from '../../../../helpers';
import { Add } from '../add/Add';
import { getList } from '../../../../services';

export function Filter(props){
  const { setError, size, handleViewChange } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [date, setDate] = useState([moment(), moment().add(7, 'days')]);
  const [day, setDay] = useState("7 хоног");
  const [classH, setClassH] = useState('tm_h_back1');
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  
  useEffect(() => {
    onFocusSite()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('tm_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('tm_h_back2');
    else setClassH('tm_h_back1');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    // let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    // onSearch && onSearch(query, filter1, date);
  }

  const onChangeDay = value => {
    setDay(value)
    if(value === "7 хоног") {
      handleViewChange('week')
      setDate([moment(), moment().add(1, 'week')])}
    else if(value === "Ажлын өдөр") {
      handleViewChange('work_week')
      setDate([moment(), moment().add(5, 'days')])}
    else if(value === "Өдөр") {
      handleViewChange('day')
      setDate([moment(), moment()])}
    else {
      handleViewChange('month')
      setDate([moment(), moment().add(1, 'months')])}
  }

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let sites1 = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(sites1);
      }
    }
  }

  const onSelectSite = value => {
    setSite(value);
    // getData(value);
  }

  const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name',
  classBack: 'rp_select_back3', className: 'rp_select', onFocus: onFocusSite, loading: loading === 'sites' };
  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back_z', className: 'rp_date' };
  const dayProps = { value: day, setValue: onChangeDay, data: week, s_value: 'value', s_descr: 'label', 
  onHide, classBack: 'rp_select_back3', className: 'rp_select',};
  const addProps = { day, site, sites, date, setDate }
  
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <PlainSelect {...dayProps} />
        <PlainSelect {...siteProps} />
      </div>
      <Add {...addProps}/>
    </div>
  );
}