import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { ExportExcel } from '../../../../helpers';
import { getList } from '../../../../services';
import { MultiSelect, DynamicAIIcon, CheckBox1 } from '../../../components/all/all_m';
import { SearchInput } from './SearchInput';

export function Header(props){
  const { setError, onSearch, size, data, columns, excelName , filter1, isDtl, setIsDtl } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [supplier, setSupplier ]= useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classH, setClassH] = useState('th_header_mn1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusSupplier();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 970) setClassH('th_header_mn1');
    else if(size?.width < 970 && size?.width >= 660) setClassH('th_header_mn2');
    else setClassH('');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onFocusSite = async () => {
    if(!sites?.length){
      setError && setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        setSites(response?.data);
        setSite(response?.data?.map(item => item.siteId));
      }
      setLoading(false);
    }
  }

  const onFocusSupplier = async () => {
    if(!suppliers?.length){
      setError && setError(null);
      setLoading('suppliers');
      const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
      if(response?.error) setError && setError(response?.error);
      else {
        setSuppliers(response?.data);
        setSupplier(response?.data?.map(item => item.vendId));
      }
      setLoading(false);
    }
  }

  const handleEnter = value => {
    onHide(value);
  }

  const onHide = value => {
    let query = '?Begin=' ;
    let q = 'Y'
    if(supplier?.length !== suppliers?.length) supplier?.forEach(item => query += '&VendID=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(!isDtl) query += '&IsDtl=' + q 
    query += (value ? ('&InvtName=' + value) : '');
    onSearch && onSearch(query, filter1);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const width = showSearch ? 0 : (size?.width > 780 ? 412 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 320 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const id = size?.width > 780 ? 'ih_large' : 'ih_small';
  const classBack = 'ih_select_back', classLabel = 'ih_select_lbl', className = 'ih_select';
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxSupp = supplier?.length === suppliers?.length ? t('time.all_supp') : (supplier?.length + t('time.some_supp'));

  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name',  onHide,
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop'), 
    classBack, classLabel, className};
  const suppProps = { value: supplier, setValue: setSupplier, data: suppliers, s_value: 'vendId', s_descr: 'vendName', onHide,
    classBack, classLabel, className ,
    label: t('supplier.title'), onFocus: onFocusSupplier, loading: loading === 'suppliers', maxTag: maxSupp, placeholder: t('time.select_supp')};
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };
  const dtlProps = { label: t('manage.is_dtl'), checked: isDtl, setChecked: setIsDtl, onHide };


  return (
    <div className='ih_header' id={id}>
        <div className={classH} >
          <div className='mn_header2'>
              <MultiSelect {...siteProps} />
              <MultiSelect {...suppProps} />
              <CheckBox1 {...dtlProps} />
          </div>
        </div>
        <div className='th_header_mn3' style={style}>
          <div className='ih_btn_row' >
            <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
          </div>    
          <DynamicAIIcon {...searchProps} />
        </div>    
        <SearchInput {...inputProps} />
    </div>    
  );
}