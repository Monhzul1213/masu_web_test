import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { copyItems, getList } from '../../../../services';
import { Button, ButtonRowAdd, DynamicAIIcon, IconButton, PlainSelect } from '../../../all';
import { SearchInput } from './SearchInput';
import { InventoryExcel } from '../../../../helpers';
import { message } from 'antd';

export function Header(props){
  const { onClickAdd, onClickDelete, show, setError, onSearch, cats, size,  columns, data, excelName, vendors } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [site, setSite] = useState(-1);
  const [categories, setCategories] = useState([{categoryId: -2, categoryName: t('inventory.all_category')}]);
  const [category, setCategory] = useState(-2);
  const [vends, setVends] = useState([]);
  const [vend, setVend] = useState();
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const onFocusVendor = async () => {
    if(!vends?.length || vends?.length === 1){
      setVends([...[{vendId: -2, vendName: t('inventory.all_vendor')}], ...vendors])
    }
  }

  const setFilter = (site1, cat1, name1, vend1) => {
    let data = [];
    if(site1 !== -1) data.push({ fieldName: 'SiteID', value: site1 });
    if(cat1 !== -2) data.push({ fieldName: 'CategoryID', value: cat1 });
    if(vend1 !== -2) data.push({ fieldName: 'VendID', value: vend1 });
    if(name1) data.push({ fieldName: 'Name', value: name1 });
    onSearch(data);
  }

  const onChangeSite = value => {
    setSite(value);
    setFilter(value, category, '', vend);
  }

  const onChangeCategory = value => {
    setCategory(value);
    setFilter(site, value, '', vend);
  }

  const onChangeVendor = value => {
    setVend(value);
    setFilter(site, value, '', value);
  }

  const handleEnter = value => {
    setFilter(site, category, value, vend);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const onClickImport = () => navigate('invt_import');

  const onClickCopy = async () => {
    const selected = data?.filter(d => d.checked);
    // dispatch(copyItems(selected));

    // message.success(t('inventory.success_copy'))
  };

  const id = size?.width > 780 ? 'ih_large' : 'ih_small';
  const width = showSearch ? 0 : (size?.width > 780 ? 412 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 412 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };
  const excelWidth = [{ wpx: 400 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 } ];

  const addProps = { type: 'inventory', onClickAdd, show, onClickDelete };
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site', classBack, classLabel, className, bStyle };
  const categoryProps = { value: category, setValue: onChangeCategory, data: categories, s_value: 'categoryId', s_descr: 'categoryName',
    label: t('inventory.category'), onFocus: onFocusCategory, loading: loading === 'category', classBack, classLabel, className, bStyle };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };
  const importProps = { className: 'ih_btn', text: t('page.import'), onClick: onClickImport };
  const exportProps = { text: t('page.export'), columns: columns, excelData: data, fileName: excelName, width: excelWidth};
  const vendProps = { value: vend, setValue: onChangeVendor, data: vends, s_value: 'vendId', s_descr: 'vendName',
  label: t('order.vend'), onFocus: onFocusVendor, loading: loading === 'vendId', classBack, classLabel, className, bStyle };

  return (
    <div className='ih_header' id={id}>
      <div className='ih_header1'>
        <ButtonRowAdd {...addProps} />
        {show && <IconButton className='add_row_btn' text={t('inventory.copy')} id='add_row_copy' onClick={onClickCopy} /> }       
        <div className='ih_btn_row'>
          <Button {...importProps} />
          <InventoryExcel {...exportProps} />
        </div>
      </div>
      <div className='ih_header2' style={style}>
        <PlainSelect {...siteProps} />
        <PlainSelect {...categoryProps} />
        <PlainSelect {...vendProps} />
        <DynamicAIIcon {...searchProps} />
      </div>
      <SearchInput {...inputProps} />
    </div>
  );
}