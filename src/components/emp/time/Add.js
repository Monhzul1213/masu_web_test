import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { sendRequest } from '../../../services';
import { add, divide } from '../../../helpers';
import { ButtonRowConfirm, Date, Error, Input, ModalTitle, Overlay, Select } from '../../all';

export function Add(props){
  const { visible, closeModal, selected, sites, emps } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: null });
  const [site, setSite] = useState({ value: null });
  const [date1, setDate1] = useState({ value: moment() });
  const [date2, setDate2] = useState({ value: moment() });
  const [time, setTime] = useState({ value: '' });
  const [total, setTotal] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setName({ value: selected?.empCode });
      setSite({ value: selected?.siteId });
      let date1 = moment(selected?.beginDate, 'yyyy.MM.DD');
      let date2 = moment(selected?.endDate, 'yyyy.MM.DD');
      setDate1({ value: date1 });
      setDate2({ value: date2 });
      let diff = date2.diff(date1, 'days');
      setTotal(selected?.totalHours);
      let time = divide(selected?.totalHours, add(diff, 1));
      setTime({ value: time + '' });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValid = () => {
    let isDateValid = checkDate(date1, date2);
    let isNameValid = name?.value || name?.value === 0;
    let isSiteValid = site?.value || site?.value === 0;
    if((isDateValid || isDateValid === 0) && isNameValid && isSiteValid){
      let data = [{
        empCode: name?.value,
        timeCardId: selected?.timeCardId ?? -1,
        siteId: site?.value,
        beginDate: date1?.value?.format('yyyy.MM.DD'),
        endDate: date2?.value?.format('yyyy.MM.DD'),
        totalHours: isDateValid,
        rowStatus: selected ? 'U' : 'I'
      }];
      return data;
    } else {
      if(!(name?.value || name?.value === 0)) setName({ value: name?.value, error: t('error.not_empty') });
      if(!(site?.value || site?.value === 0)) setSite({ value: site?.value, error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    let data = checkValid();
    if(data){
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Employee/TimeCard', data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('time.add_success'));
      }
      setLoading(false);
    }
  }

  const onClickDelete = async () => {
    setError(null);
    setLoading(true);
    let data = [{...selected, rowStatus: 'D'}];
    const response = await dispatch(sendRequest(user, token, 'Employee/TimeCard', data));
    if(response?.error) setError(response?.error);
    else {
      closeModal(true);
      message.success(t('time.delete_success'));
    }
    setLoading(false);
  }

  const onChangeDate1 = value => {
    setDate1(value);
    checkDate(value, date2);
  }

  const onChangeDate2 = value => {
    setDate2(value);
    checkDate(date1, value);
  }

  const checkDate = (d1, d2) => {
    let dt1 = moment(d1?.value?.format('yyyy.MM.DD'), 'yyyy.MM.DD');
    let dt2 = moment(d2?.value?.format('yyyy.MM.DD'), 'yyyy.MM.DD');
    let diff = dt2.diff(dt1, 'days');
    if(diff < 0){
      setDate2({ value: d2?.value, error: t('error.date_early') });
      setTotal(0);
      return false;
    } else {
      let hours = parseFloat(time?.value ? time?.value : 0);
      let total = divide(hours, add(diff, 1), true);
      setTotal(total);
      return total;
    }
  }

  const changeTime = value => {
    let text = value?.value?.split(".", 2).join(".").replace(/[^0-9.]/g, "");
    let hours = parseFloat(text ? text : 0);
    let diff = date2?.value?.diff(date1?.value, 'days');
    setTotal(divide(hours, add(diff, 1), true));
    setTime({ value: text });
  }

  const nameProps = { value: name, setValue: setName, label: t('employee.title'), placeholder: t('time.select_emp'), 
    data: emps, setError, s_value: 'empCode', s_descr: 'empName', disabled: selected ? true : false };
  const siteProps = { value: site, setValue: setSite, label: t('shop.title'), placeholder: t('time.select_shop'), 
    data: sites, setError, s_value: 'siteId', s_descr: 'name', disabled: selected ? true : false  };
  const disabledDate = d => !d || d.isAfter(moment().add(1, 'day').format('yyyy-MM-DD'));
  const date1Props = { value: date1, setValue: onChangeDate1, label: t('time.date1'), inRow: true, disabledDate };
  const date2Props = { value: date2, setValue: onChangeDate2, label: t('time.date2'), inRow: true, disabledDate };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete, isModal: true };
  const timeProps = { value: time, setValue: changeTime, label: t('time.time'), placeholder: t('time.time'), setError, length: 20 };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={440}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSchedule' title={t(selected ? 'time.edit' : 'time.add')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Select {...nameProps} />
              <Select {...siteProps} />
              <div className='ac_row' style={{marginTop: 20}}>
                <Date {...date1Props} />
                <div className='gap' />
                <Date {...date2Props} />
              </div>
              <Input {...timeProps} />
              <p className='m_footer'>{t('time.total')}: {total}</p>
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRowConfirm {...btnProps} />
      </Overlay>
    </Modal>
  )
}