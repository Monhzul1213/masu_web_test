import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../services';
import { ButtonRowAddConfirm, MultiSelect } from '../../all';

export function Header(props){
  const { onClickAdd, show, onClickDelete, setError, onSearch } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [emp, setEmp] = useState([]);
  const [emps, setEmps] = useState([]);
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

  const onChangeSite = value => {
    setSite(value);
    // let api = '?SiteID=' + value;
    // onSearch(api);
  }

  const onChangeEmp = value => {
    setEmp(value);
    // let api = '?SiteID=' + value;
    // onSearch(api);
  }

  const addProps = { type: 'time', onClickAdd, show, onClickDelete };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('cashier.pay_shop2') };
  const empProps = { value: emp, setValue: onChangeEmp, data: emps, s_value: 'empCode', s_descr: 'empName', className: 'ih_select',
    label: t('employee.title'), onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp') };

  return (
    <div className='i_list_header'>
      <ButtonRowAddConfirm {...addProps} />
      <div className='i_list_header1'>
        <MultiSelect {...empProps} />
        <MultiSelect {...siteProps} />
      </div>
      {/*
        <DynamicAIIcon {...searchProps} />
      */}
    </div>
  );
}