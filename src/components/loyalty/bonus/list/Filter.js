import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getConstants } from '../../../../services';
import { ButtonRowAddConfirm, DynamicAIIcon, PlainRange, PlainSelect } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';

export function Filter(props){
  const { size, onClickAdd, onSearch, setError } = props;
  const { t } = useTranslation();
  const [classH, setClassH] = useState('th_header1');
  const [showSearch, setShowSearch] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{valueNum: -1, valueStr1: t('order.all_status')}]);
  const [type, setType] = useState(-1);
  const [types, setTypes] = useState([{valueNum: -1, valueStr1: t('bonus.all_type')}]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(size?.width >= 890) setClassH('th_header1');
    else if(size?.width < 890 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = await dispatch(getConstants(user, token, 'msBonus_Status'));
      if(response?.error) setError && setError(response?.error);
      else setStates([...[{valueNum: -1, valueStr1: t('order.all_status')}], ...response?.data]);
      setLoading(null);
    }
  }

  const onFocusType = async () => {
    if(!types?.length || types?.length === 1){
      setError && setError(null);
      setLoading('type');
      const response = await dispatch(getConstants(user, token, 'msBonus_BonusType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{valueNum: -1, valueStr1: t('bonus.all_type')}], ...response?.data];
        setTypes(data?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  }

  const onHide = (status, name) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(status !== -1) query += '&Status=' + status;
    query += name ? '&Name=' + name : '';
    onSearch(query);
  }

  const onChangeStatus = value => {
    setStatus(value);
    onHide(value, search);
  }

  const onChangeType = value => {
    setType(value);
    onHide(value, search);
  }

  const handleEnter = value => {
    onHide(status, value);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const id = size?.width > 890 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 890 ? 647 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const addProps = { type: 'bonus', onClickAdd, show: false };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), 
    onHide: () => onHide(status), className: 'rh_date'};
  const classBack = 'cou_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 890 ? 180 : ((size?.width - 52) / 2) };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'valueNum', s_descr: 'valueStr1',
    label: t('order.status'), onFocus: onFocusStatus, classBack, classLabel, className, bStyle, loading: loading === 'status' };
  const typeProps = { value: type, setValue: onChangeType, data: types, s_value: 'valueNum', s_descr: 'valueStr1',
    label: t('bonus.type'), onFocus: onFocusType, classBack: 'cou_select_back1', classLabel, className, bStyle, loading: loading === 'type' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 412 : (size?.width - 30));
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };

  return (
    <div className='ih_header' id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH} style={style}>
        <PlainRange {...dateProps} />
        <div className='th_header_s' >
          <PlainSelect {...statProps} />
          <PlainSelect {...typeProps} />
          <DynamicAIIcon {...searchProps} style={{marginTop: 18}}/>
        </div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}