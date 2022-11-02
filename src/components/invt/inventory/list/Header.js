import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { ButtonRowAdd, PlainSelect } from '../../../all';

export function Header(props){
  const { onClickAdd, onClickDelete, show, setError, onSearch } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [site, setSite] = useState(-1);
  const [loading, setLoading] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

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

  const onChangeSite = value => {
    setSite(value);
    onSearch(value);
  }

  const addProps = { type: 'inventory', onClickAdd, show, onClickDelete };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site' };

  return (
    <div className='i_list_header'>
      <ButtonRowAdd {...addProps} />
      <div className='i_list_header1'>
        <PlainSelect {...siteProps} />
      </div>
    </div>
  );
}