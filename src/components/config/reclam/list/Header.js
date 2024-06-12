import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { PlainRange, PlainSelect, ButtonRowAddConfirm } from '../../../all/all_m';
import { MultiSelect } from '../../../all/all_m';
import { getList } from '../../../../../services';

export function Header(props){
  const { setError, onSearch, size, onClickAdd, onClickDelete, show } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{label: t('order.all_status'), value: -1, }]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classH, setClassH] = useState('th_header1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusStatus();
    onFocusSite();
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
      const response = t('reclam.statusl');
      let data = [...[{label: t('reclam.status') , value: -1 }], ...response];
      setStates(data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading(null);
    }
  }
  const onFocusSite = async () => {
    if(!sites?.length){
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        setSites(response?.data);
        setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(status !== -1) query += '&Status=' + status;
    console.log(query)
    onSearch(query);
  }

  const onChangeStatus = value => {
    setStatus(value);
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(value !== -1) query += '&Status=' + value;
    onSearch(query)
  }

  const id = size?.width > 870 ? 'ih_large' : 'ih_small';

  const classBack = 'th_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };
  const siteProps = {value: site, setValue: setSite, data: site, s_value: 'value', s_descr:'label',
    label: t('order.site'), onFocus: onFocusStatus, loading: loading === 'site', classBack, classLabel, className, bStyle };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', s_descr: 'label',
    label: t('reclam.status'), onFocus: onFocusStatus, loading: loading === 'status', classBack, classLabel, className, bStyle };
  const addProps = { type: 'reclam', onClickAdd, show, onClickDelete };

  return (
    <div className='ih_header' id={id} >
      <ButtonRowAddConfirm {...addProps} />
      <div className={classH} >
        <PlainRange {...dateProps} />
        <div className='th_header_s'>
          <MultiSelect {...siteProps}/>
          <PlainSelect {...statProps} />
        </div>
      </div>
    </div>
  );
}