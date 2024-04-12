import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getConstants } from '../../../../services';
import { CheckBox, Date, Input, Select, Time } from '../../../all';

function Card(props){
  const { size, setError, setEdited, name, setName, beginDate, useTime, setUseTime, setBeginDate, endDate, setEndDate, beginTime, setBeginTime,
    endTime, setEndTime, type, setType, status, setStatus } = props;
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let response = await getTypes();
    if(response) await getStates();
  }

  const getTypes = async id => {
    if(!types?.length){
      setError(null);
      setLoading('types');
      const response = await dispatch(getConstants(user, token, 'msBonus_BonusType'));
      setLoading(null);
      if(response?.error){
        setError(response?.error);
        return false;
      } else {
        setTypes(response?.data);
        return true;
      }
    }
    return true;
  }
  
  const getStates = async () => {
    if(!states?.length){
      setError(null);
      setLoading('states');
      const response = await dispatch(getConstants(user, token, 'msBonus_Status'));
      if(response?.error) setError(response?.error);
      else setStates(response?.data);
      setLoading(null);
    }
  }

  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('bonus.name'), setError, setEdited, inRow: true, length: 75 };
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true, setError, setEdited };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true, setError, setEdited };
  const timeProps = { checked: useTime, setChecked: setUseTime, label: t('bonus.use'), style: { marginTop: 15 } };
  const time1Props = {  value: beginTime, setValue: setBeginTime, label: t('bonus.begin'), inRow: true, setError, setEdited };
  const time2Props = {  value: endTime, setValue: setEndTime, label: t('bonus.end'), inRow: true, setError, setEdited };
  const typeProps = { value: type, setValue: setType, label: t('bonus.type1'), setError, setEdited, data: types, inRow: true,
    s_value: 'valueNum', s_descr: 'valueStr1', loading: loading === 'types', onFocus: getTypes };
  const statProps = { value: status, setValue: setStatus, label: t('bonus.status'), setError, setEdited, data: states, inRow: true,
    s_value: 'valueNum', s_descr: 'valueStr1', loading: loading === 'states', onFocus: getStates };

  return (
    <div className='ia_back'>
      <Input {...nameProps}/>
      <div className='ac_row' style={{marginTop: 15}}>
        <Date {...date1Props} />
        <div className='gap' />
        <Date {...date2Props} />
      </div>
      <CheckBox {...timeProps} />
      {useTime && <div className='ac_row' style={{marginTop: 15}}>
        <Time {...time1Props} />
        <div className='gap' />
        <Time {...time2Props} />
      </div>}
      <div id={idRow} style={{marginTop: 15}}>
        <Select {...typeProps} />
        <div className='gap' />
        <Select {...statProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);