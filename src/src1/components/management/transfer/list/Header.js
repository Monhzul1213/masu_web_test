import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../../services';
import { PlainRange, PlainSelect, ButtonRowAddConfirm } from '../../../all/all_m';

export function Header(props){
  const { setError, onSearch, size, onClickAdd, onClickDelete, show } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState(-1);
  const [fromSite, setFromSite] = useState(-1);
  const [fromSites, setFromSites] = useState([{name: t('time.all_shop'), siteId: -1 }]);
  const [toSite, setToSite] = useState(-1);
  const [toSites, setToSites] = useState([{name: t('time.all_shop'), siteId: -1 }]);
  const [states, setStates] = useState([{label: t('order.all_status'), value: -1, }]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [loading, setLoading] = useState(false);
  const [classH, setClassH] = useState('th_header1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusStatus()
    onFocusFromSite()
    onFocusToSite()
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

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = t('advert.types');
      let data = [...[{label: t('order.all_status') , value: -1 }], ...response];
      setStates(data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading(null);
    }
  }

  const onFocusFromSite = async () => {
    if(!fromSites?.length || fromSites?.length === 1){
      setError && setError(null);
      setLoading('fromSites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{name: t('time.all_shop') , siteId: -1 }], ...response?.data];
        setFromSites(data?.sort((a, b) => a.valueNum - b.valueNum));
        // setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const onFocusToSite = async () => {
    if(!toSites?.length || toSites?.length === 1){
      setError && setError(null);
      setLoading('toSites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{name: t('time.all_shop') , siteId: -1 }], ...response?.data];
        setToSites(data?.sort((a, b) => a.value - b.value));
        // setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(status !== -1) query += '&Status=' + status;
    if(fromSite !== -1) query += '&FromSiteID=' + fromSite;
    if(toSite !== -1) query += '&ToSiteID=' + toSite;
    onSearch(query);
  }

  const onChangeStatus = value => {
    setStatus(value);
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(value !== -1) query += '&Status=' + value;
    onSearch(query)
  }

  const onChangeFromSite = value => {
    setFromSite(value);
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(value !== -1) query += '&FromSiteID=' + value;
    onSearch(query)
  }

  const onChangeToSite = value => {
    setToSite(value);
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(value !== -1) query += '&ToSiteID=' + value;
    onSearch(query)
  }

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };

  const classBack = 'th_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };
  const fromSiteProps = { value: fromSite, setValue: onChangeFromSite, data: fromSites, s_value: 'siteId', s_descr: 'name',  onHide,
    label: t('transfer.from_site'), onFocus: onFocusFromSite, loading: loading === 'fromSites',  placeholder: t('time.select_shop'), 
    classBack, classLabel, className};
  const toSiteProps = { value: toSite, setValue: onChangeToSite, data: toSites, s_value: 'siteId', s_descr: 'name',  onHide,
    label: t('transfer.to_site'), onFocus: onFocusToSite, loading: loading === 'toSites', placeholder: t('time.select_shop'), 
    classBack, classLabel, className};
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', s_descr: 'label',
    label: t('order.status'), onFocus: onFocusStatus, loading: loading === 'status', classBack, classLabel, className, bStyle };
  const addProps = { type: 'transfer', onClickAdd, show, onClickDelete };

  return (
    <div className='ih_header' id={id} style={{paddingTop: 0}}>
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH} style={{marginTop: 0}}>
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