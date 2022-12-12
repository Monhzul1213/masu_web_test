import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getList } from '../../../../services';
import { ButtonRowAdd, DynamicAIIcon, PlainSelect } from '../../../all';
import { SearchInput } from '../../../invt/inventory/list/SearchInput';

export function Header(props){
  const { size, onClickAdd, setError, onSearch } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [vendor, setVendor] = useState(-1);
  const [vendors, setVendors] = useState([{vendId: -1, vendName: t('order.all_vendor')}]);
  const [status, setStatus] = useState(-1);
  const [states, setStates] = useState([{vendId: -1, vendName: t('order.all_status')}]);
  const [id2, setId2] = useState('po_filter1')
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(size?.width >= 830) setId2('po_filter1');
    else if(size?.width < 830 && size?.width >= 640) setId2('po_filter2');
    else setId2('po_filter3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

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

  const onFocusVendor = async () => {
    if(!vendors?.length || vendors?.length === 1){
      setError && setError(null);
      setLoading('vendor');
      const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{vendId: -1, vendName: t('order.all_vendor')}], ...response?.data];
        setVendors(data);
      }
      setLoading(null);
    }
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setError && setError(null);
      setLoading('status');
      setStates([{vendId: -1, vendName: t('order.all_status')}])
      // const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
      // if(response?.error) setError && setError(response?.error);
      // else {
      //   let data = [...[{vendId: -1, vendName: t('order.all_vendor')}], ...response?.data];
      //   setVendors(data);
      // }
      setLoading(null);
    }
  }
  
  const onClickSearch = () => setShowSearch(!showSearch);

  const setFilter = (status, vendor, site) => {
    let query = '';
    if(status !== -1) query += '?Status=' + status;
    if(vendor !== -1) query += (status === -1 ? '?' : '&') + 'VendID=' + vendor;
    if(site !== -1) query += ((status === -1 && vendor === -1) ? '?' : '&') + 'SiteID=' + site;
    onSearch(query);
  }

  const handleEnter = value => {
    if(value) onSearch('?OrderNo=' + value);
    else setFilter(status, vendor, site);
  }

  const onChangeSite = value => {
    setSite(value);
    setFilter(status, vendor, value);
  }

  const onChangeVendor = value => {
    setVendor(value);
    setFilter(status, value, site);
  }

  const onChangeStatus = value => {
    setStatus(value);
    setFilter(value, vendor, site);
  }

  const id = size?.width >= 830 ? 'po_large' : 'po_small';
  const addProps = { type: 'order', onClickAdd };
  const width = showSearch ? 0 : (size?.width > 830 ? 610 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 412 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1, className: 'po_filter_input' };
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };
  const siteProps = { value: site, setValue: onChangeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'site', classBack, classLabel, className, bStyle };
  const vendProps = { value: vendor, setValue: onChangeVendor, data: vendors, s_value: 'vendId', s_descr: 'vendName',
    label: t('order.vend'), onFocus: onFocusVendor, loading: loading === 'vendor', classBack, classLabel, className, bStyle };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'vendId', s_descr: 'vendName',
    label: t('order.status'), onFocus: onFocusStatus, loading: loading === 'status', classBack, classLabel, className, bStyle };
  
  return (
    <div id={id}>
      <ButtonRowAdd {...addProps} />
      <div id={id2} style={style}>
        <div className='po_filter_row1'>
          <PlainSelect {...statProps} />
          <PlainSelect {...vendProps} />
        </div>
        <div className='po_filter_row2'>
          <PlainSelect {...siteProps} />
          <DynamicAIIcon {...searchProps} />
        </div>
      </div>
      <SearchInput {...inputProps} />
    </div>
  )
}