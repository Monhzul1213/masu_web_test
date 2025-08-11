import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { PlainRange, PlainSelect, ButtonRowAddConfirm } from '../../../../../components/all';
import { getList } from '../../../../../services'; 

export function Header(props) {
  const { setError, onSearch, size, onClickAdd, onClickDelete, show } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{ label: t('order.all_status'), value : -1}]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [site, setSite] = useState(-1);
  const [sites1, setSites1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classH, setClassH] = useState('th_header1');
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusStatus();
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (size?.width >= 470) setClassH('th_header1');
    else if (size?.width < 470 && size?.width >= 320) setClassH('th_header2');
    else setClassH('th_header3');
  }, [size?.width]);

  const onFocusStatus = async () => {
    if (!states?.length || states?.length === 1) {
      setError && setError(null);
      setLoading('status');
      const response = t('reclam.statusl');
      let data = [{ label: t('reclam.status'), value: -1 }, ...response];
      setStates(data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading(null);
    }
  };

  const getSites = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if (response?.error) {
      setError(response?.error);
    } else {
      let sites1 = [{ siteId: -1, name: t('reclam.all') }, ...response?.data];
      setSites1(sites1);
    }
  };

  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if (site !== -1) query += '&SiteID=' + site;
    if (status !== -1) query += '&Status=' + status;
    onSearch(query);
  };

  const onChangeStatus = value => {
    setStatus(value);
    onHide();
  };

  const onSelectSite = value => {
    setSite(value);
    onHide();
  };

  const classBack = 'th_select_back', className = 'ih_select';
  const dateProps = { value: date, setValue: setDate, placeholder: t('time.select_date'), onHide, className: 'rh_date' };
  const bStyle = { maxWidth: size?.width > 600 ? 100 : (size?.width - 47) };
  const siteProps = { value: site, setValue: onSelectSite, data: sites1, s_value: 'siteId', s_descr: 'name', className,
    loading: loading === 'site', classBack };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', onFocus: onFocusStatus,
    loading: loading === 'status', classBack, className, bStyle };
  const addProps = { type: 'reclam', onClickAdd, show, onClickDelete };

  return (
    <div className='ih_header' id='mo_large'>
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