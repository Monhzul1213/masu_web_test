import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { Button, ButtonRowAdd, DynamicAIIcon, PlainSelect } from '../../../all';
import { SearchInput } from './SearchInput';

export function Header(props){
  const { onClickAdd, onClickDelete, show, setError, onSearch, cats, size } = props;
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

  const setFilter = (site1, cat1, name1) => {
    let data = [];
    if(site1 !== -1) data.push({ fieldName: 'SiteID', value: site1 });
    if(cat1 !== -2) data.push({ fieldName: 'CategoryID', value: cat1 });
    if(name1) data.push({ fieldName: 'Name', value: name1 });
    onSearch(data);
  }

  const onChangeSite = value => {
    setSite(value);
    setFilter(value, category, '');
  }

  const onChangeCategory = value => {
    setCategory(value);
    setFilter(site, value, '');
  }

  const handleEnter = value => {
    setFilter(site, category, value);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const id = size?.width > 780 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 780 ? 440 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 440 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };

  const addProps = { type: 'inventory', onClickAdd, show, onClickDelete };
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site', classBack, classLabel, className };
  const categoryProps = { value: category, setValue: onChangeCategory, data: categories, s_value: 'categoryId', s_descr: 'categoryName',
    label: t('inventory.category'), onFocus: onFocusCategory, loading: loading === 'category', classBack, classLabel, className };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };
  const importProps = { className: 'ih_btn', text: t('page.import'), disabled: true };
  const exportProps = { className: 'ih_btn', text: t('page.export'), disabled: true };

  return (
    <div className='ih_header' id={id}>
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        <div className='ih_btn_row' style={{display: 'none'}}>
          <Button {...importProps} />
          <Button {...exportProps} />
        </div>
      </div>
      <div className='ih_header2' style={style}>
        <PlainSelect {...siteProps} />
        <PlainSelect {...categoryProps} />
        <DynamicAIIcon {...searchProps} />
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}