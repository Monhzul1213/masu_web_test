import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { status } from '../../../../helpers';
import { getList } from '../../../../services';
import { DynamicAIIcon, MonthRange, MultiSelect } from '../../all/all_m';

import { ButtonAdd } from "../../../../src2/components/ButtonRow";
import { OrderCreateModal } from "../../../../src2/components/orderCreate/orderCreateModal";

export function Filter(props) {
  const { setError, size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([moment(), moment()]);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [emps, setEmps] = useState([]);
  const [emp, setEmp] = useState([]);
  const [state, setState] = useState([]);
  const [visible, setVisible] = useState(false);
  const [classH, setClassH] = useState('rp_h_back1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    onFocusStatus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('rp_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('rp_h_back2');
    else setClassH('rp_h_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(emp?.length !== emps?.length) emp?.forEach(item => query += '&EmpCode=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(state?.length !== status?.length) state?.forEach(item => query += '&Status=' + item);
    onSearch && onSearch(query, filter1, date);
  };

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
  };

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
  };

  const onFocusStatus = async () => {
    if(!state?.length){
      setError && setError(null);
      setLoading('status');
      const response = status;
      setState(response?.map(item => item?.status))
      setLoading(false);
    }
  };

  const onClickAdd = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };
  
  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const maxStatus = state?.length === status?.length ? t('time.all_status') : (state?.length + t('time.some_status'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineShop' className='mr_cal' />, classBack: 'rp_select_back',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop') };
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineUser' className='mr_cal' />, classBack: 'rp_select_back1',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp') };
  const statProps = { value: state, setValue: setState, data: status, s_value: 'status', s_descr: 'statusName', onHide,
    Icon: () => <DynamicAIIcon name='AiOutlineProfile' className='mr_cal' />, classBack: 'rp_select_back2',
    className: 'rp_select', dropdownStyle: { marginLeft: -30, minWidth: 180 }, dropdownAlign: { offset: [-30, 5] },
    onFocus: onFocusStatus, loading: loading === 'status', maxTag: maxStatus,  placeholder: t('orders.select_status') };
  const modalProps = { visible, closeModal, setVisible };
  
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
      </div>
      <div className='rp_h_row2'>
        <MultiSelect {...siteProps} />
        <MultiSelect {...empProps} />
        <MultiSelect {...statProps} />
        <div style={{ marginLeft: 15 }}>
          <ButtonAdd
            className="add_row_btn"
            text="Захиалга үүсгэх"
            onClickAdd={onClickAdd}
          />
        </div>
        {visible && <OrderCreateModal {...modalProps} siteProps={siteProps} />}
      </div>
    </div>
  );
}