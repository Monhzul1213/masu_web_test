import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import '../../css/timetable.css'
// import { getList } from '../../../services';
import { DynamicAIIcon, MonthRange, PlainSelect, Button } from '../../components/all/all_m';
import { week } from '../../../helpers';
import { Add } from './Add';

export function Filter(props){
  const { setError, size, onSearch, filter1 } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment(), moment().add(7, 'days')]);
  const [day, setDay] = useState(7);
  const [classH, setClassH] = useState('tm_h_back1');
  // const { user, token }  = useSelector(state => state.login);
  // const dispatch = useDispatch();

  useEffect(() => {

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 920) setClassH('tm_h_back1');
    else if(size?.width < 920 && size?.width >= 520) setClassH('tm_h_back2');
    else setClassH('tm_h_back1');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    // onSearch && onSearch(query, filter1, date);
  }

  const onChangeDay = value => {
    setDay(value)
    if(value === 7) setDate([moment(), moment().add(7, 'days')])
    else if(value === 5) setDate([moment(), moment().add(5, 'days')])
    else if(value === 1) setDate([moment(), moment().add(1, 'days')])
    else setDate([moment(), moment().add(1, 'months')])
  }

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'rp_date_back', className: 'rp_date' };
  const dayProps = { value: day, setValue: onChangeDay, data: week, s_value: 'value', s_descr: 'label', onHide, classBack: 'rp_select_back', className: 'rp_select',};
  const addProps = { }
  
  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <PlainSelect {...dayProps} />
      </div>
      <Add {...addProps}/>
    </div>
  );
}