import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { ButtonRowAddConfirm, DynamicAIIcon, PlainSelect } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';

export function Header(props){
  const { onClickAdd, show, onClickDelete, onSearch, setError, size } = props;
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

  const id = size?.width > 440 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 440 ? 217 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 465 ? 250 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const bStyle = { maxWidth: size?.width > 440 ? 180 : 167 };

  const addProps = { type: 'employee', onClickAdd, show, onClickDelete };
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading, classBack, classLabel, className, bStyle };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };

  return (
    <div className='ih_header' id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <div className='ih_header2' style={style}>
        <PlainSelect {...siteProps} />
        <DynamicAIIcon {...searchProps} />
      </div>
      <SearchInput {...inputProps} />
    </div>
  )
}