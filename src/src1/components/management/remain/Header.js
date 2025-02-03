import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { ExportExcel, useDebounce } from '../../../../helpers';
import { getList, sendRequest } from '../../../../services';
import { DynamicAIIcon, CheckBox1, DynamicMDIcon, Button, AllSelect, CheckBox } from '../../../components/all/all_m';
import { SearchInput } from './SearchInput';
import { Date1, InvtSelect } from '../../../../components/all';

export function Header(props){
  const { setError, onSearch, size, data, setData, columns, excelName , filter1, isDtl, setIsDtl, isDate, setIsDate } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [supplier, setSupplier ]= useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invt, setInvt] = useState([]);
  const [invts, setInvts] = useState([]);
  const [date, setDate] = useState({ value: moment() });
  const [text, setText] = useDebounce();
  const [classH, setClassH] = useState('th_header_mn1');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onFocusSite();
    onFocusSupplier();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if(size?.width >= 1100) setClassH('th_header_mn1');
    else if(size?.width < 1100 && size?.width >= 760) setClassH('th_header_mn2');
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

  const getData = async value => {
    if(value?.length > 3){
      setLoading(true);
      let filter = [{ fieldName: "Name", value }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      if(response?.error) setError && setError(response?.error);
      else {
        setInvts(response?.data);
      }
      setLoading(false);
    }
  }

  const handleEnter = value => {
    onHide(value);
  }

  const onHide = (value) => {
    let query = '?='
    if(supplier?.length !== suppliers?.length) supplier?.forEach(item => query += '&VendID=' + item);
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    query += (value ? ('&InvtName=' + value) : '');
    query += (isDtl ? ('&IsDtl=' + 'Y') : '');
    if(isDate) query += '&begindate=' + date?.value?.format('yyyy.MM.DD') + '&enddate=' + date?.value?.format('yyyy.MM.DD');
    invt?.forEach(item => query += '&InvtId=' + item);
    onSearch && onSearch(query, filter1);
  }

  const onHide1 = value => {
    let q = 'Y', q1 = 'N'
    let query = !isDtl ? '?IsDtl=' + q : '?IsDtl=' + q1;
    onSearch && onSearch(query, filter1);
  }

  const onClickSearch = () => setShowSearch(!showSearch);

  const onClickRefresh = async () => {
    setLoading(true);
    let api = 'Txn/GetHandQty';
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    // if(response?.error) setError(response?.error);
    // else {
      setData(response?.data);
    // }
    setLoading(false);  
  }

  const onClickImport = () => navigate('remain_import');

  // const width = showSearch ? 0 : (size?.width > 780 ? 1200 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 370 : (size?.width - 30));
  const style = { overflow: 'hidden', transition: 'width 0.2s ease-in', marginTop: 10 };
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
  const refreshProps = { className: 'ih_refresh', name: 'MdRefresh', onClick: onClickRefresh };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };
  const dtlProps = { label: t('manage.is_dtl'), checked: isDtl, setChecked: setIsDtl, onHide: onHide1 };
  const importProps = { className: 'ih_btn', text: t('page.import'), onClick: onClickImport };
  const invtProps = { value: invt, setValue: setInvt, data: invts, s_value: 'invtId', s_descr: 'name', onHide, label: t('inventory.title'),
    classBack: 'ih_select_back', className: 'ih_select', classLabel: 'ih_select_lbl', dropdownStyle: { marginLeft: -30, minWidth: 180 },
    loading: loading === 'invts', placeholder: t('inventory.search'), onSearch: setText, text };
  const dateCheckProps = { label: t('manage.is_date'), checked: isDate, setChecked: setIsDate, id: 'is_check3'};
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), className: 'mn_date', classBack: 're_select_back', onHide, classLabel };

  return (
    <div className='ih_header' id={id} style={{paddingTop: 0}}>
        <div className={classH} >
          <div className='mn_header2'>
              <AllSelect {...siteProps} />
              <AllSelect {...suppProps} />
              <InvtSelect {...invtProps}/>
          </div>
          <div className='is_dtl'>
              <CheckBox1 {...dtlProps} /> 
              <div className='is_check3'>
                <CheckBox {...dateCheckProps} /> 
              </div>
              {isDate && <Date1 {...dateProps}/>}
          </div>
        </div>
        <div className='th_header_mn4' style={style}>
          <div className='ih_btn_row_mn' >
            <Button {...importProps} />
            <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
            <DynamicAIIcon {...searchProps} />
            <DynamicMDIcon {...refreshProps} />
          </div>    
        </div>    
        <SearchInput {...inputProps} />
    </div>    
  );
}