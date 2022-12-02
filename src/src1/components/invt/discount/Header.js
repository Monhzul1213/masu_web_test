import React, { useState } from 'react';
import {  ButtonRowAddConfirm, PlainSelect } from '../../../components/all/all_m';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';

export function Header(props){
  const { onClickAdd, onClickDelete, show, onSearch, setError, size  } = props;
  
  const { t } = useTranslation();
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(data);
      }
      setLoading(false);
    }
  }
  const onChangeSite = value => {
    setSite(value);
    let api = '?siteId=' + value;
    onSearch(api);
  }
  const id = size?.width > 380 ? 'di_large' : 'di_small';
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', classBack: 'di_select_back', className: 'di_select',
    onFocus: onFocusSite, loading: loading === 'sites' , };
  const addProps = { type: 'discount', onClickAdd, show, onClickDelete };

  return (
    <div className='ih_header' id= {id}>  
      <ButtonRowAddConfirm {...addProps} />
      <PlainSelect {...siteProps} />
      </div>
  );
}