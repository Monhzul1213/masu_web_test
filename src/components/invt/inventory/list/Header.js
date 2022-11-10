import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { ButtonRowAdd, DynamicAIIcon, PlainSelect } from '../../../all';
import { SearchInput } from './SearchInput';

export function Header(props){
  const { onClickAdd, onClickDelete, show, setError, onSearch, cats } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [site, setSite] = useState(-1);
  const [categories, setCategories] = useState([{categoryId: -2, categoryName: t('inventory.all_category')}]);
  const [category, setCategory] = useState(-2);
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
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

  const onFocusCategory = async () => {
    if(!categories?.length || categories?.length === 1){
      setCategories([...[{categoryId: -2, categoryName: t('inventory.all_category')}], ...cats])
    }
  }

  const onChangeSite = value => {
    setSite(value);
    onSearch(value, category, '');
  }

  const onChangeCategory = value => {
    setCategory(value);
    onSearch(site, value, '');
  }

  const handleEnter = value => {
    onSearch(site, category, value);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const addProps = { type: 'inventory', onClickAdd, show, onClickDelete };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'ih_select',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site' };
  const categoryProps = { value: category, setValue: onChangeCategory, data: categories, s_value: 'categoryId', s_descr: 'categoryName',
    className: 'ih_select', label: t('inventory.category'), onFocus: onFocusCategory, loading: loading === 'category' };
  const style = { width: showSearch ? 0 : 440, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch };

  return (
    <div className='i_list_header'>
      <ButtonRowAdd {...addProps} />
      <div className='i_list_header1' style={style}>
        <PlainSelect {...siteProps} />
        <PlainSelect {...categoryProps} />
        <DynamicAIIcon {...searchProps} />
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}