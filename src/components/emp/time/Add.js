import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { sendRequest } from '../../../services';
import { ButtonRowConfirm, Date, Error, ModalTitle, Overlay, Select, Time } from '../../all';

export function Add(props){
  const { visible, closeModal, selected, sites, emps } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: null });
  const [site, setSite] = useState({ value: null });
  const [date1, setDate1] = useState({ value: moment() });
  const [date2, setDate2] = useState({ value: moment() });
  const [time1, setTime1] = useState({ value: '' });
  const [time2, setTime2] = useState({ value: '' });
  const [total, setTotal] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
  }, []);

  const checkValid = () => {
    let isDateValid = checkDate(date1, date2);
    let isNameValid = name?.value || name?.value === 0;
    let isSiteValid = site?.value || site?.value === 0;
    if(isDateValid && isNameValid && isSiteValid){
      let beginTime = moment(date1?.value?.format('yyyy.MM.DD') + ' ' + time1?.value, 'yyyy.MM.DD HH:mm')?.toISOString();
      let endTime = moment(date2?.value?.format('yyyy.MM.DD') + ' ' + time2?.value, 'yyyy.MM.DD HH:mm')?.toISOString();
      let data = [{
        empCode: name?.value,
        timeCardId: selected?.timeCardId ?? -1,
        siteId: site?.value,
        beginTime,
        endTime,
        totalHours: total,
        rowStatus: selected ? 'U' : 'I'
      }];
      return data;
    } else {
      if(!(name?.value || name?.value === 0)) setName({ value: name?.value, error: t('error.not_empty') });
      if(!(site?.value || site?.value === 0)) setSite({ value: site?.value, error: t('error.not_empty') });
      if(!time1?.value) setTime1({ value: time1?.value, error: t('error.not_empty') })
      if(!time2?.value) setTime2({ value: time2?.value, error: t('error.not_empty') })
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
    // setError(null);
    // setOpen(false);
    // if(sure){
      // setLoading(true);
    //   const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
    //   console.log(response);
    //   if(response?.error) setError(response?.error);
    //   else {
    //     closeModal(true);
    //     message.success(t('shop.delete_success'));
    //   }
    //   setLoading(false);
    // }
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
    let duration = moment.duration(dt2.diff(dt1));
    let hours = +(duration?.asHours()?.toFixed(2));
    if(hours >= 0){
      setDate2({ value: d2?.value });
      setDisabled(false);
      return checkTime(d1, d2, time1, time2);
    } else {
      setDate2({ value: d2?.value, error: t('error.date_early') });
      setDisabled(true);
      setTotal(0);
      return false;
    }
  }

  const onChangeTime1 = value => {
    checkTime(date1, date2, value, time2);
  }

  const onChangeTime2 = value => {
    checkTime(date1, date2, time1, value);
  }

  const checkTime = (d1, d2, t1, t2) => {
    if(t1?.value && t2?.value){
      const dt1 = moment(d1?.value?.format('yyyy.MM.DD') + ' ' + t1?.value, 'yyyy.MM.DD HH:mm');
      const dt2 = moment(d2?.value?.format('yyyy.MM.DD') + ' ' + t2?.value, 'yyyy.MM.DD HH:mm');
      let duration = moment.duration(dt2.diff(dt1));
      let hours = +(duration?.asHours()?.toFixed(2));
      if(hours >= 0){
        setTotal(hours);
        setTime2({ value: t2?.value });
        return true;
      } else {
        setTime2({ value: t2?.value, error: t('error.time_early') });
        setTotal(0);
        return false;
      }
    } else return false;
  }

  const nameProps = { value: name, setValue: setName, label: t('employee.title'), placeholder: t('time.select_emp'), 
    data: emps, setError, s_value: 'empCode', s_descr: 'empName' };
  const siteProps = { value: site, setValue: setSite, label: t('shop.title'), placeholder: t('time.select_shop'), 
    data: sites, setError, s_value: 'siteId', s_descr: 'name' };
  const disabledDate = d => !d || d.isAfter(moment().add(1, 'day').format('yyyy-MM-DD'));
  const date1Props = { value: date1, setValue: onChangeDate1, label: t('time.date1'), inRow: true, disabledDate };
  const date2Props = { value: date2, setValue: onChangeDate2, label: t('time.date2'), inRow: true, disabledDate };
  const time1Props = { value: time1, setValue: setTime1, label: t('time.time1'), inRow: true, onTime: onChangeTime1, disabled };
  const time2Props = { value: time2, setValue: setTime2, label: t('time.time2'), inRow: true, onTime: onChangeTime2, disabled, handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete, isModal: true };

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
              <div className='ac_row' style={{marginTop: 20}}>
                <Time {...time1Props} />
                <div className='gap' />
                <Time {...time2Props} />
              </div>
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