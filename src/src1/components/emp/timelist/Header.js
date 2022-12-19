import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../../services';
import { Button, MultiSelect, PlainRange } from '../../../components/all/all_m';

export function Header(props){
  const { setError, onSearch, sites, emps, setSites, setEmps, size } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [emp, setEmp] = useState([]);
  const [classH, setClassH] = useState('th_header1');
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

  useEffect(() => {
    if(size?.width >= 870) setClassH('th_header1');
    else if(size?.width < 870 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

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
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(emp?.length !== emps?.length) emp?.forEach(item => query += '&EmpCodes=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteIDs=' + item);
    onSearch(query)
  }
  const id = size?.width > 780 ? 'ih_large' : 'ih_small';
  const classBack = 'th_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name',  onHide,
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop'), 
    classBack, classLabel, className};
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide,
  classBack, classLabel, className ,
    label: t('employee.title'), onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp')};
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date_z' , };
    const exportProps = { text: t('page.export'), className: 'rp_list_select', disabled: true };

  return (
    <div className='ih_header' id={id}  >
        <div className='ih_btn_row_z' //style={{display: 'none'}} 
        >
          <Button {...exportProps} />
        </div>
        <div className={classH}>
            <PlainRange {...dateProps} />
            <div className='th_header_s'>
              <MultiSelect {...empProps} />
              <MultiSelect {...siteProps} />
            </div>
        </div>   
    </div>
      
  );
}