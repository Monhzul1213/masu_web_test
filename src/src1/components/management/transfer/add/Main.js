import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getList } from '../../../../../services';
import { DescrInput, Select } from '../../../../../components/all';

export function Main(props){
  const { setError, setEdited, header, detail, toSiteId, setToSiteId, fromSiteId, setFromSiteId, notes, setNotes, editable } = props;
  const { t } = useTranslation();
  const [fromSites, setFromSites] = useState([]);
  const [toSites, setToSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const disabled = detail?.length ? true : false;

  useEffect(() => {
    if(header){
      onFocusFromSite() 
      onFocusToSite();
    } 
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header]);

  const onFocusFromSite = async () => {
    if(!fromSites?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else setFromSites(response?.data);
    }
  }

  const onFocusToSite = async () => {
    if(!toSites?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else setToSites(response?.data);
    }
  }

  const fromSiteProps = { value: fromSiteId, setValue: setFromSiteId, label: t('transfer.from_site'), placeholder: t('order.site'), data: fromSites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusFromSite, loading, disabled };
  const toSiteProps = { value: toSiteId, setValue: setToSiteId, label: t('transfer.to_site'), placeholder: t('order.site'), data: fromSites, setError, setEdited,
    s_value: 'siteId', s_descr: 'name', inRow: true, onFocus: onFocusToSite, loading, disabled };
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, setError, length: 100, disabled: !editable };

  return (
    <div className='tr_back'>
      {header?.transferNo ? <p className='ps_header_no' style={{marginBottom: 10}}>{header?.transferNo}</p> : null}
      <div className='ac_row' style={{marginTop: 0}}>
          <Select {...fromSiteProps} />
          <div className='gap' />
          <Select {...toSiteProps} />
        </div>
      <DescrInput {...descrProps} />
    </div>
  );
}