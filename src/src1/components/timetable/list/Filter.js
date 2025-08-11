import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import '../../../css/timetable.css'
import { PlainSelect } from '../../../components/all/all_m';
import { week } from '../../../../helpers';
import { Add } from '../add/Add';
import { getList } from '../../../../services';
import { MonthRange } from './Date';

export function Filter(props){
  const { setError, size, handleViewChange, onSearch, day, setDay, navigateContants, onNavigate, date, setDate, setSDate, filter } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  // const [date, setDate] = useState([moment().startOf('week'), moment().endOf('week')]);
  const [classH, setClassH] = useState('tm_h_back1');
  const [classF, setClassF] = useState('tm_h_back1');
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [repeatType, setRepeatType] = useState("W");
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  
  useEffect(() => {
    onFocusSite()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 965) setClassH('tm_h_back1');
    else if(size?.width < 965 && size?.width >= 510) setClassH('tm_h_back2');
    else setClassH('tm_h_back2');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    if(size?.width >= 700) setClassF('tm_h_row1');
    else if(size?.width < 700 && size?.width >= 410) setClassF('tm_h_row2');
    else setClassF('tm_h_row2');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onChangeDay = value => {
    let query = '';
    setDay(value)
    if(value === "7 хоног") {
      onNavigate(moment().startOf('week'), "7 хоног", navigateContants?.DATE)
      handleViewChange('week')
      setRepeatType('W')
      setDate([moment().startOf('week'), moment().endOf('week')])
      query += '?BeginDate=' + moment().startOf('week')?.format('yyyy.MM.DD') + '&EndDate=' + moment().endOf('week')?.format('yyyy.MM.DD');
    }
    else if(value === "Ажлын өдөр") {
      onNavigate(moment().startOf('week'), "Ажлын өдөр", navigateContants?.DATE)
      handleViewChange('work_week')
      setRepeatType("A")
      setDate([moment().startOf('week'), moment().endOf('week')])
      query += '?BeginDate=' + moment().startOf('week')?.format('yyyy.MM.DD') + '&EndDate=' + moment().endOf('week')?.format('yyyy.MM.DD');
    }
    else if(value === "Өдөр") {
      setSDate(moment())
      onNavigate(moment(), "Өдөр", navigateContants?.DATE)
      handleViewChange('day') 
      setRepeatType("D")
      setDate([moment(), moment()])
      query += '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' +moment()?.format('yyyy.MM.DD');
    }
    else {
      onNavigate(moment().startOf('month'), 'Сар', navigateContants?.DATE)
      handleViewChange('month')
      setRepeatType("M")
      setDate([moment().startOf('month'), moment().endOf('month')])
      query += '?BeginDate=' + moment().startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment().endOf('month')?.format('yyyy.MM.DD');
    }
    onSearch(query);
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

  const onHide = (site) => {
    // onNavigate(date[0], day)
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(site !== -1) query += '&SiteID=' + site;
    onSearch(query);
  }

  const onChangeSite = value => {
    setSite(value);
    onHide(value);
  }


  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
  classBack: 'rp_select_back3', className: 'rp_select', onFocus: onFocusSite, loading: loading === 'sites' };
  const dateProps = { value: date, setValue: setDate, onHide: () => onHide(site), classBack: 'rp_date_back_z', 
  className: 'rp_date', navigateContants, onNavigate, day };
  const dayProps = { value: day, setValue: onChangeDay, data: week, s_value: 'value', s_descr: 'label', 
  onHide, classBack: 'rp_select_back3', className: 'rp_select',};
  const addProps = { day, site, sites, repeatType, onSearch, filter }
  
  return (
    <div className={classH}>
      <div className={classF}>
        <MonthRange {...dateProps} />
        <div className='rp_h_row1'>
          <PlainSelect {...dayProps} />
          <PlainSelect {...siteProps} />
        </div>
      </div>
      <Add {...addProps}/>
    </div>
  );
}