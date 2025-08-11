import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getConstants } from '../../../../services';
import { CheckBox, Date, Input, Select, Time } from '../../../all';
import { ColorSelect } from '../../../../src1/components/all/all_m';

function Card(props){
  const { size, setError, setEdited, name, setName, beginDate, useTime, setUseTime, setBeginDate, endDate, setEndDate, beginTime, setBeginTime,
    endTime, setEndTime, status, setStatus, color, setColor, disabled } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getStates();
    getColors();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getColors = async () => {
    if(!colors?.length){
      setError(null);
      setLoading('colors');
      const response = await dispatch(getConstants(user, token, 'msBonus_Color'));
      if(response?.error) setError(response?.error);
      else setColors(response?.data?.sort((a,b) => a.valueNum - b.valueNum));
      setLoading(null);
    }
  }

  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('bonus.name'), setError, setEdited, inRow: true, length: 75, disabled };
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true, setError, setEdited };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true, setError, setEdited };
  const timeProps = { checked: useTime, setChecked: setUseTime, label: t('bonus.use'), style: { marginTop: 15 } };
  const time1Props = {  value: beginTime, setValue: setBeginTime, label: t('bonus.begin'), inRow: true, setError, setEdited };
  const time2Props = {  value: endTime, setValue: setEndTime, label: t('bonus.end'), inRow: true, setError, setEdited };
  const statProps = { value: status, setValue: setStatus, label: t('bonus.status'), setError, setEdited, data: states, inRow: true,
    s_value: 'valueNum', s_descr: 'valueStr1', loading: loading === 'states', onFocus: getStates };
  const colorProps = { value: color, setValue: setColor, data: colors, s_value: 'valueStr1', s_descr: 'valueStr1',
    label: t('coupon.color'), onFocus: getColors, inRow: true, loading: loading === 'colors' };

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
        <ColorSelect {...colorProps}/>
        <div className='gap' />
        <Select {...statProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);