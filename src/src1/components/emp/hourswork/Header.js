import React, { useState } from 'react';
import {  PlainSelect } from '../../all/all_m';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, } from 'react-redux';
import { getList } from '../../../services';

export function Header(props){
  const {  getData    } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(-1);
  const [sites, setSites ] = useState([{siteId: -1, name: t('pos.all')}]);

  const dispatch = useDispatch()
  const { user , token }  = useSelector(state => state.login);

  const onSelectSite = value => {
    setSite(value);
    getData(value);
  }
  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let sites1 = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(sites1);
      }
    }
  }

const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'r_select_z',
  onFocus: onFocusSite, loading: loading === 'sites' };
  
  return (
    <div className='i_list_header_z'>  
 
        <PlainSelect {...siteProps} />

    </div>
  );
}