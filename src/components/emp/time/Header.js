import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { ButtonRowAddConfirm, MultiSelect, PlainRange } from '../../all';

export function Header(props){
  const { onClickAdd, show, onClickDelete, setError, onSearch, sites, emps, setSites, setEmps } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [emp, setEmp] = useState([]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onHide = () => {
    let query = '?BeginTime=' + date[0]?.toISOString() + '&EndTime=' + date[1]?.toISOString();
    emp?.forEach(item => query += '&EmpCodes=' + item);
    site?.forEach(item => query += '&SiteIDs=' + item);
    onSearch(query)
  }

  const addProps = { type: 'time', onClickAdd, show, onClickDelete };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select', onHide,
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', className: 'ih_select', onHide,
    label: t('employee.title'), onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp') };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };
  
  return (
    <div className='i_list_header'>
      <ButtonRowAddConfirm {...addProps} />
      <div className='i_list_header1'>
        <PlainRange {...dateProps} />
        <MultiSelect {...empProps} />
        <MultiSelect {...siteProps} />
      </div>
    </div>
  );
}