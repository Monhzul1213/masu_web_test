import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../services';
import { ButtonRowAddConfirm, MultiSelect, PlainRange } from '../../all';

export function Header(props){
  const { onClickAdd, show, onClickDelete, setError, onSearch } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [emp, setEmp] = useState([]);
  const [emps, setEmps] = useState([]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onFocusSite = async () => {
    if(!sites?.length){
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else setSites(response?.data);
      setLoading(false);
    }
  }

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError && setError(null);
      setLoading('emps');
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      if(response?.error) setError && setError(response?.error);
      else setEmps(response?.data);
      setLoading(false);
    }
  }

  const onHide = () => {
    onSearch(date, emp, site);
  }

  const addProps = { type: 'time', onClickAdd, show, onClickDelete };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select', onHide,
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('cashier.pay_shop2') };
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