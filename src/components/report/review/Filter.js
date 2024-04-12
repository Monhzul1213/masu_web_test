import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker, Button } from 'antd';
import { AiOutlineLeft, AiOutlineRight, AiOutlineCalendar } from "react-icons/ai";
import 'antd/dist/antd.css';
import moment from 'moment';

import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect } from '../../all';

export function Filter(props) {
  const { RangePicker } = DatePicker;
  const { maxTag, className, placeholder, disabled } = props;
  const [date, setDate] = useState([moment(), moment()]);

  const onClick = isNext => {
    const diff = date[1]?.diff(date[0], 'days');
    const add = (diff + 1) * (isNext ? 1 : -1);
    const begin = moment(date[0]?.add(add, 'days'));
    const end = moment(date[1]?.add(add, 'days'));
    setDate([begin, end]);
    onHide();
  };
  const onOpenChange = show => {
    // if (!show) onHide(); 
  };
  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if (site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    onSearch && onSearch(query, filter1, date);
  }

  const { setError, size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [classH, setClassH] = useState('rp_h_back1');
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { };
  }, []);

  useEffect(() => {
    if (size?.width >= 920) setClassH('rp_h_back1');
    else if (size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const onFocusSite = async () => {
    if (!sites?.length) {
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if (response?.error) setError && setError(response?.error);
      else {
        setSites(response?.data);
        setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const siteProps = {
    value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name',
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop')
  };

  return (
    <div className='search-section'>
      <div className='rp_date_back'>
        <Button className='mr_btn' id='mr_btn1' onClick={() => onClick(false)}><AiOutlineLeft /></Button>
        <span className="mr_cal"><AiOutlineCalendar /></span>
        <RangePicker
          className={'ant-picker ant-picker-range rp_date'}
          suffixIcon={null}
          allowClear={false}
          placeholder={placeholder}
          onOpenChange={onOpenChange}
          value={date}
          format='YYYY.MM.DD'
          disabled={disabled}
          onChange={setDate} />
        <Button className='mr_btn' id='mr_btn2' onClick={() => onClick(true)}><AiOutlineRight /></Button>

      </div>

      <MultiSelect {...siteProps} />
    </div>
  );
}