import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList, sendRequest } from '../../../services';
import { DynamicAIIcon, DynamicMDIcon, InvtSelect, MonthRange, MultiSelect, TimeRange } from '../../all';
import { useDebounce } from '../../../helpers';

export function Filter(props){
  const { setError, size, onSearch, filter1, invt, setInvt } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment(), moment()]);
  const [time, setTime] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [invts, setInvts] = useState([]);
  const [emps, setEmps] = useState([]);
  const [emp, setEmp] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [text, setText] = useDebounce();
  const [classH, setClassH] = useState('rp_h_back1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    onFocusCustomer();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if(size?.width >= 920) setClassH('rp_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(time) query += '&BeginTime=' + time[0] + '&EndTime=' + time[1]
    if(emp?.length !== emps?.length) emp?.forEach(item => query += '&EmpCode=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(customer?.length !== customers?.length) customer?.forEach(item => query += '&CustID=' + item);
    invt?.forEach(item => query += '&InvtId=' + item);
    onSearch && onSearch(query, filter1, date);
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

  const onFocusCustomer = async () => {
    if(!customers?.length){
      setError && setError(null);
      setLoading('custs');
      let headers = {CustID: -1}
      const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
      if(response?.error) setError && setError(response?.error);
      else {
        setCustomers(response?.data?.customers);
        setCustomer(response?.data?.customers?.map(item => item?.custId));
      }
      setLoading(false);
    }
  }


  const getData = async value => {
    if(value?.length > 3){
      setLoading(true);
      let filter = [{ fieldName: "Name", value }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      if(response?.error) setError && setError(response?.error);
      else {
        setInvts(response?.data);
      }
      setLoading(false);
    }
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const timeProps = { value: time, setValue: setTime, onHide, classBack: 'rp_time_back', label: t('report_receipt.all_day') };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const maxCust = customer?.length === customers?.length ? t('receive.all_cust') : (customer?.length + t('receive.some_cust'));
  const maxInvt =  ( '+' + invt?.length + t('inventory.invt'));

  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };
    
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back1',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp') };
    
  const invtProps = { value: invt, setValue: setInvt, data: invts, s_value: 'invtId', s_descr: 'name', onHide,
    Icon: () => <DynamicMDIcon name='MdOutlineInventory2' className='mr_cal' />, classBack: 'rp_select_back4',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 250 }, dropdownAlign: { offset: [-30, 5] },
    loading: loading === 'invts', maxTag: maxInvt, placeholder: t('inventory.search'), onSearch: setText, text };
  
  const cusProps = { value: customer, setValue: setCustomer, data: customers, s_value: 'custId', s_descr: 'custName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back2',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusCustomer, loading: loading === 'customers', maxTag: maxCust, placeholder: t('receive.some_cust') };
   
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <TimeRange {...timeProps} />
      </div>
      <div className='rp_h_row2'>
        <MultiSelect {...siteProps} />
        <MultiSelect {...empProps} />
        <MultiSelect {...cusProps} />
        <InvtSelect {...invtProps} />
      </div>
    </div>
  );
}