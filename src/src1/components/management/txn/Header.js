import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { ExportExcel, useDebounce } from '../../../../helpers';
import { getList, getConstants, sendRequest } from '../../../../services';
import { MultiSelect, DynamicAIIcon, DynamicMDIcon, PlainRange } from '../../all/all_m';
import { SearchInput } from './SearchInput';
import { InvtSelect } from '../../../../components/all';

export function Header(props){
  const { setError, onSearch, size, data, setData, columns, excelName , filter1 } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [site, setSite] = useState([]);
  const [sites, setSites] = useState([]);
  const [supplier, setSupplier ]= useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [emp, setEmp] = useState([]);
  const [emps, setEmps] = useState([]);
  const [constant, setConstant] = useState([]);
  const [constants, setConstants] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [classH, setClassH] = useState('th_header_mn1');
  const [loading, setLoading] = useState(false);
  const [invt, setInvt] = useState([]);
  const [invts, setInvts] = useState([]);
  const [text, setText] = useDebounce();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSite();
    onFocusEmp();
    onFocusSupplier();
    onFocusConstant();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

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

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError && setError(null);
      setLoading('emps');
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      if(response?.error) setError && setError(response?.error);
      else {
        setEmps(response?.data);
        setEmp(response?.data?.map(item => item.empCode));
      }
      setLoading(false);
    }
  }

  const onFocusConstant = async () => {
    if(!constants?.length){
      setError && setError(null);
      setLoading('constants');
      const response = await dispatch(getConstants(user, token, 'inTxnCost_TxnType'));
      if(response?.error) setError && setError(response?.error);
      else {
        setConstants(response?.data);
        setConstant(response?.data?.map(item => item.valueNum));
      }
      setLoading(null);
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

  const onHide = value => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(site?.length !== sites?.length) site?.forEach(item => query += '&SiteID=' + item);
    if(emp?.length !== emps?.length) emp?.forEach(item => query += '&EmpCode=' + item);
    if(constant?.length !== constants?.length) constant?.forEach(item => query += '&TxnType=' + item);
    if(supplier?.length !== suppliers?.length) supplier?.forEach(item => query += '&VendID=' + item);
    query += (value ? ('&InvtName=' + value) : '');
    invt?.forEach(item => query += '&InvtId=' + item);
    onSearch && onSearch(query, filter1, date);
  }

  const onClickRefresh = async () => {
    setLoading(true);
    let api = 'Txn/GetTxnCost' + '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD') ;
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data);
    }
    setLoading(false);  
  }

  const onClickSearch = () => setShowSearch(!showSearch);


  const width = showSearch ? 0 : (size?.width > 780 ? 320 : (size?.width - 30));
  const width1 = !showSearch ? 0 : (size?.width > 470 ? 375 : (size?.width - 30));
  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const id = size?.width > 1080 ? 'ih_large' : 'ih_small';
  const classBack = 'ih_select_back2', classLabel = 'ih_select_lbl', className = 'ih_select';
  const maxSite = site?.length === sites?.length ? t('time.all_shop') : (site?.length + t('time.some_shop'));
  const maxEmp = emp?.length === emps?.length ? t('time.all_emp') : (emp?.length + t('time.some_emp'));
  const maxSupp = supplier?.length === suppliers?.length ? t('time.all_supp') : (supplier?.length + t('time.some_supp'));
  const maxConstant = constant?.length === constants?.length ? t('time.all_constant') : (constant?.length + t('time.some_constant'));

  const siteProps = { value: site, setValue: setSite, data: sites, s_value: 'siteId', s_descr: 'name',  onHide,
    label: t('inventory.t_site'), onFocus: onFocusSite, loading: loading === 'sites', maxTag: maxSite, placeholder: t('time.select_shop'), 
    classBack, classLabel, className};
  const suppProps = { value: supplier, setValue: setSupplier, data: suppliers, s_value: 'vendId', s_descr: 'vendName', onHide,
    classBack, classLabel, className ,
    label: t('supplier.title'), onFocus: onFocusSupplier, loading: loading === 'suppliers', maxTag: maxSupp, placeholder: t('time.select_supp')};
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date', classBack: 'rh_select_back' };
  const empProps = { value: emp, setValue: setEmp, data: emps, s_value: 'empCode', s_descr: 'empName',  onHide,
    label: t('employee.title'), onFocus: onFocusEmp, loading: loading === 'emps', maxTag: maxEmp, placeholder: t('time.select_emp'), 
    classBack, classLabel, className};
  const consProps = { value: constant, setValue: setConstant, data: constants, s_value: 'valueNum', s_descr: 'valueStr1',  onHide,
    label: t('report.constant'), onFocus: onFocusConstant, loading: loading === 'constants', maxTag: maxConstant, placeholder: t('time.select_constant'), 
    classBack, classLabel, className};
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch, width: width1 };
  const refreshProps = { className: 'ih_refresh', name: 'MdRefresh', onClick: onClickRefresh };
  const invtProps = { value: invt, setValue: setInvt, data: invts, s_value: 'invtId', s_descr: 'name', onHide, label: t('inventory.title'),
    classBack: 'ih_select_back', className, classLabel, dropdownStyle: { marginLeft: -30, minWidth: 180 },
    loading: loading === 'sites', placeholder: t('inventory.search'), onSearch: setText, text };
 
  return (
    <div className='ih_header' id={id} style={{paddingTop: 0}}>
        <div className={classH} >
            <div className='mn_header2' >
                <PlainRange {...dateProps} />
                <MultiSelect {...siteProps} />
                <MultiSelect {...empProps} />
            </div>  
            <div className='mn_header2' >
                <MultiSelect {...consProps} />
                <MultiSelect {...suppProps} />
                <InvtSelect {...invtProps}/>
            </div>            
        </div>
        <div className='th_header_mn' style={style} >
            <div className='ih_btn_row_z' >
              <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
            </div>
            <DynamicAIIcon {...searchProps} style ={{ marginTop: 12}} />
            <DynamicMDIcon {...refreshProps} style ={{ marginTop: 12}}/>
        </div>
        <SearchInput {...inputProps} />
    </div>
      
  );
}