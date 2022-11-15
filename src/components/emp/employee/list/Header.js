import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { ButtonRowAddConfirm, DynamicAIIcon, PlainSelect } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';

export function Header(props){
  const { onClickAdd, show, onClickDelete, onSearch, setError } = props;
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
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
    let api = '?SiteID=' + value;
    onSearch(api);
  }

  const handleEnter = value => {
    let api = '?SiteID=' + site + (value ? ('&EmpName=' + value) : '');
    onSearch(api);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const addProps = { type: 'employee', onClickAdd, show, onClickDelete };
  const style = { width: showSearch ? 0 : 440, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch };

  return (
    <div className='i_list_header'>
      <ButtonRowAddConfirm {...addProps} />
      <div className='i_list_header1' style={style}>
        <PlainSelect {...siteProps} />
        <DynamicAIIcon {...searchProps} />
      </div>
      <SearchInput {...inputProps} />
    </div>
  )
}