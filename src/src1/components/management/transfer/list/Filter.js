import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../../../services';
import { ButtonRowAddConfirm, PlainRange, PlainSelect } from '../../../all/all_m';

export function Filter(props){
  const { size, onClickAdd, onSearch, setError } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [classH, setClassH] = useState('th_header1');
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [fromSite, setFromSite] = useState(-1);
  const [fromSites, setFromSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [toSite, setToSite] = useState(-1);
  const [toSites, setToSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{valueNum: -1, valueStr1: t('order.all_status')}]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(size?.width >= 870) setClassH('th_header1');
    else if(size?.width < 870 && size?.width >= 660) setClassH('th_header2');
    else setClassH('th_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onFocusFromSite = async () => {
    if(!fromSites?.length || fromSites?.length === 1){
      setError && setError(null);
      setLoading('fromSite');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setFromSites(data);
      }
      setLoading(null);
    }
  }

  const onFocusToSite = async () => {
    if(!toSites?.length || toSites?.length === 1){
      setError && setError(null);
      setLoading('fromSite');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let tsite= []
        response?.data.forEach(item =>{
          if(item?.siteId !== fromSite){
            tsite.push(item)
          }
          })        
        let data = [...[{siteId: -1, name: t('pos.all')}], ...tsite];
        setToSites(data);      
      }
        setLoading(null);
    }
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { valueNum: -1, valueStr1: t('order.all_status') },
        { valueNum: 0, valueStr1: 'Түр хадгалах' },
        { valueNum: 1, valueStr1: 'Хөдөлгөөн хийсэн' },
      ]);
    }
  }

  const onHide = (fromSite, toSite, status) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(status !== -1) query += '&Status=' + status;
    if(fromSite !== -1) query += '&FromSiteID=' + fromSite;
    if(toSite !== -1) query += '&ToSiteID=' + toSite;
    onSearch(query);
  }

  const onChangeFromSite = value => {
    setFromSite(value);
    onHide(value, toSite, status);
  }

  const onChangeToSite = value => {
    setToSite(value);
    onHide(fromSite, value, status);
  }

  const onChangeStatus = value => {
    setStatus(value);
    onHide(fromSite, toSite, value);
  }

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';
  const addProps = { type: 'transfer', onClickAdd, show: false };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide: () => onHide(fromSite, toSite, status), className: 'rh_date' };
  const classBack = 'th_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };
  const fromSiteProps = { value: fromSite, setValue: onChangeFromSite, data: fromSites, s_value: 'siteId', s_descr: 'name',
    label: t('transfer.from_site'), onFocus: onFocusFromSite, loading: loading === 'fromSite', classBack, classLabel, className, bStyle };
  const toSiteProps = { value: toSite, setValue: onChangeToSite, data: toSites, s_value: 'siteId', s_descr: 'name',
    label: t('transfer.to_site'), onFocus: onFocusToSite, loading: loading === 'toSite', classBack, classLabel, className, bStyle };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'valueNum', s_descr: 'valueStr1',
    label: t('order.status'), onFocus: onFocusStatus, loading: loading === 'status', classBack, classLabel, className, bStyle };

  return (
    <div className='ih_header' id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH}>
        <PlainRange {...dateProps} />
        <div className='th_header_s'>
          <PlainSelect {...fromSiteProps} />
          <PlainSelect {...toSiteProps} />
          <PlainSelect {...statProps} />
        </div>
      </div>
    </div>
  );
}