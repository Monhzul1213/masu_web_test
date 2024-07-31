import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getList } from '../../../../../services';
import { DescrInput, Date, Input, Select } from '../../../../../components/all';

export function Main(props){
  const { setError, setEdited, header, detail, siteId, setSiteId, notes, setNotes, editable, empCode, setEmpCode,
          count, setCount, date, setDate, status, setStatus } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const disabled = detail?.length ? true : false;
  const disabled1 = !header ? true : false;

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusSite = async () => {
    if(!sites?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else setSites(response?.data);
    }
  }

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else setEmps(response?.data);
    }
  }

  const empProps = { value: empCode, setValue: setEmpCode, label: t('employee.title'), placeholder: t('employee.title'), data: emps, setError, setEdited,
  s_value: 'empCode', s_descr: 'empName', inRow: true, onFocus: onFocusEmp, loading, disabled: true };
  const siteProps = { value: siteId, setValue: setSiteId, label: t('order.site'), placeholder: t('order.site'), data: sites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusSite, loading, disabled };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100, disabled: !editable, inRow: true };
  const noProps = { value: count, setValue: setCount, label: t('count.title'), placeholder: t('count.title'), inRow: true, disabled: true,  };
  const dateProps = { value: date, setValue: setDate, label: t('count.date'), placeholder: t('count.date'), inRow: true, className: 'c_date', disabled: !editable };
  const statusProps = { value: status, setValue: setStatus, label: t('order.status'), placeholder: t('order.status'), data: t('count.status'), setError, setEdited,
     inRow: true, loading, disabled: disabled1 || status?.value === 2 ||  status?.value === 3};

  return (
    <div className='ad_back'>
      <div className='ad_main'>
        <div className='ad_row'>
          <Input {...noProps}/>
          <div className='gap' />
          <div style={{marginTop: 0, flex: 1}}><Date {...dateProps} /></div>
        </div>
        <div className='ad_row1'>
          <Select {...empProps} />
          <div className='gap' />
          <Select {...siteProps} />
        </div>
        <div className='ad_row1'>
          <Select {...statusProps} />
          <div className='gap' />
          <DescrInput {...descrProps} />
        </div>
      </div>
    </div>
  );
}