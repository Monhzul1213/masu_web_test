import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList } from '../../../../services';
import { ButtonRowAddConfirm, PlainRange, PlainSelect } from '../../../all';

export function Filter(props){
  const { size, onClickAdd, onSearch, setError } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [classH, setClassH] = useState('th_header1');
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
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

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading('site');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(data);
      }
      setLoading(null);
    }
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { valueNum: -1, valueStr1: t('order.all_status') },
        { valueNum: 0, valueStr1: 'Түр хадгалах' },
        { valueNum: 1, valueStr1: 'Тохируулга хийсэн' },
      ]);
    }
  }

  const onHide = (site, status) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(status !== -1) query += '&Status=' + status;
    if(site !== -1) query += '&SiteID=' + site;
    onSearch(query);
  }

  const onChangeSite = value => {
    setSite(value);
    onHide(value, status);
  }

  const onChangeStatus = value => {
    setStatus(value);
    onHide(site, value);
  }

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';
  const addProps = { type: 'adjust', onClickAdd, show: false };
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide: () => onHide(site, status), className: 'rh_date' };
  const classBack = 'th_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : (((size?.width ?? 200) - 52) / 2) };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site', classBack, classLabel, className, bStyle };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'valueNum', s_descr: 'valueStr1',
    label: t('order.status'), onFocus: onFocusStatus, loading: loading === 'status', classBack, classLabel, className, bStyle };

  return (
    <div className='ih_header' id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH}>
        <PlainRange {...dateProps} />
        <div className='th_header_s'>
          <PlainSelect {...siteProps} />
          <PlainSelect {...statProps} />
        </div>
      </div>
    </div>
  );
}