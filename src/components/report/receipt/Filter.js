import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect, TimeRange } from '../../all';

export function Filter(props){
  const { setError } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [time, setTime] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [emps, setEmps] = useState([]);
  const [emp, setEmp] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    console.log(query);
    // onSearch && onSearch(query);
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

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError && setError(null);
      setLoading('emps');
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      if(response?.error) setError && setError(response?.error);
      else {
        setEmps(response?.data);
        setEmp(response?.data?.map(item => item.empCode));
      }
      setLoading(false);
    }
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const timeProps = { value: time, setValue: setTime, onHide, classBack: 'rp_time_back', label: t('report_receipt.all_day') };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxSite, placeholder: t('time.select_emp') };

  return (
    <div className='rp_h_back'>
      <MonthRange {...dateProps} />
      <TimeRange {...timeProps} />
      <MultiSelect {...siteProps} />
      <MultiSelect {...empProps} />
    </div>
  );
}