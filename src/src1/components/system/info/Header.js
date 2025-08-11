import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { getConstants } from '../../../../services';
import { PlainRange , DynamicAIIcon, PlainSelect, DynamicMDIcon, IconSelect } from '../../../../components/all';
import { Search } from './Search';

export function Header(props){
  const { onSearch, size , show ,data, filter, setError, value, setValue , data1, className1} = props;
  const { t } = useTranslation();
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [classH, setClassH] = useState('info_header1');
  const [classT, setClassT] = useState('info_hd1');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subType, setSubtype] = useState(-1);
  const [subTypes, setSubtypes] = useState([{valueNum: -1, valueStr1: 'Бүгд'}]);
  const [type, setType] = useState(-1);
  const [types, setTypes] = useState([{valueNum: -1, valueStr1: 'Бүгд'}]);
  const [batch, setBatch] = useState(-1);
  const [batchs, setBatchs] = useState([{valueNum: -1, valueStr1: 'Бүгд'}]);
  const [sale, setSale] = useState(-1);
  const [sales, setSales] = useState([{valueNum: -1, valueStr1: 'Бүгд'}]);
  const [noat, setNoat] = useState(-1);
  const [noats, setNoats] = useState([{valueNum: -1, valueStr1: 'Бүгд'}]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    // onFocusSubtype();
    onFocusType();
    onFocusBatch();
    onFocusSales();
    onFocusNoat();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 1000) setClassH('info_header1');
    else if(size?.width < 1000 && size?.width >= 540) setClassH('info_header2');
    else setClassH('info_header3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    if(size?.width >= 1100) setClassT('info_hd1');
    else if(size?.width < 1100 && size?.width >= 540) setClassT('info_hd2');
    else setClassT('info_hd3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const handleEnter = value => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    query += (value ? ('&filter=' + value) : '');
    onSearch && onSearch( query , filter);
  }


  const onFocusSubtype = async (value) => {
    if(!subTypes?.length || subTypes?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = await dispatch(getConstants(user, token, 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let num = [];
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n2 = string.startsWith(value)
          if ( n2 === true ){ 
              num.push(item) 
            } })
        let data = [...[{valueNum: -1, valueStr1: 'Бүгд'}], ...num];
        setSubtypes(data?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  };

  const onFocusType = async () => {
    if(!types?.length || types?.length === 1){
      setTypes([
        { valueNum: -1, valueStr1: 'Бүгд' },
        { valueNum: 2, valueStr1: 'Нийлүүлэлт' },
        { valueNum: 1, valueStr1: 'Борлуулалт' },
      ]);
    }
  };

  const onFocusBatch = async () => {
    if(!batchs?.length || batchs?.length === 1){
      setBatchs([
        { valueNum: -1, valueStr1: 'Бүгд' },
        { valueNum: 'Premium', valueStr1: 'Premium' },
        { valueNum: 'Standard', valueStr1: 'Standard' },
        { valueNum: 'Free', valueStr1: 'Free' },
      ]);
    }
  }  
  const onFocusSales = async () => {
    if(!sales?.length || sales?.length === 1){
      setSales([
        { valueNum: -1, valueStr1: 'Бүгд' },
        { valueNum: 'Y', valueStr1: 'Борлуулалттай' },
        { valueNum: 'N', valueStr1: 'Борлуулалтгүй' },
      ]);
    }
  }  
  const onFocusNoat = async () => {
    if(!noats?.length || noats?.length === 1){
      setNoats([
        { valueNum: -1, valueStr1:'Бүгд' },
        { valueNum: 'Y', valueStr1: 'НӨАТ төлөгч' },
        { valueNum: 'N', valueStr1: 'НӨАТ төлөгч биш' },
      ]);
    }
  }

  const onHide = (type, subtype, batch, sale, noat) => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    if(subtype !== -1 && subtype !== undefined) query += '&MerchantSubType=' + subtype;
    if(type !== -1 && type !== undefined) query += '&MerchantType=' + type;
    if(batch !== -1 && batch !== undefined) query += '&SubType=' + batch;
    if(sale !== -1 && sale !== undefined) query += '&IsSales=' + sale;
    if(noat !== -1 && noat !== undefined) query += '&IsNuat=' + noat;
    if(search?.length !== 0) data?.forEach(item => {
      query += '&filter=' + item?.customer
    });
    onSearch && onSearch(query, filter, date );
  }

  const onChangeSubtype = value => {
    setSubtype(value);
    onHide(type, value, batch, sale, noat);
  };

  const onChangeType = value => {
    setType(value);
    onHide(value, subType, batch, sale, noat);
    onFocusSubtype(value)
  };

  const onChangeBatch = value => {
    setBatch(value);
    onHide(type, subType, value, sale, noat);
  };
  
  const onChangeSales = value => {
    setSale(value);
    onHide(type, subType, batch, value, noat);
  };
  
  const onChangeNoat = value => {
    setNoat(value);
    onHide(type, subType, batch, sale, value);
  };

  const onClickSearch = () => setShowSearch(!showSearch);
  const classBack = 'ih_select_back3', classLabel = 'ih_select_lbl', className = 'ih_select';
  const bStyle = { maxWidth: size?.width > 780 ? 180 : ((size?.width - 52) / 2) };

  const style = { overflow: 'hidden', transition: 'width 0.2s ease-in' };
  const width1 = !showSearch ? 0 : (size?.width > 495 ? 300 : (size?.width - 20));
  const dateProps = { label: t('page.date'), value: date, setValue: setDate, placeholder: t('time.select_date'), onHide,
    className: 'rh_date' };
  const inputProps = { showSearch, setShowSearch, handleEnter, search, setSearch , onSearch, width: width1, show , className: 'rp_list_search_back_s' , date};
  const searchProps = { className: 'ih_search', name: 'AiOutlineSearch', onClick: onClickSearch };
  const subTypeProps = { value: subType, setValue: onChangeSubtype, data: subTypes, s_value: 'valueNum', s_descr: 'valueStr1', //disabled : type === -1 ? true : false,
  label: t('info.subtype'),  loading: loading === 'subType', classBack, classLabel, className, bStyle };
  const typeProps = { value: type, setValue: onChangeType, data: types, s_value: 'valueNum', s_descr: 'valueStr1',
  label: t('info.type'), onFocus: onFocusType, loading: loading === 'type', classBack, classLabel, className, bStyle };
  const batchProps = { value: batch, setValue: onChangeBatch, data: batchs, s_value: 'valueNum', s_descr: 'valueStr1',
  label: t('info.batch'), onFocus: onFocusBatch, loading: loading === 'batch', classBack, classLabel, className, bStyle };
  const salesProps = { value: sale, setValue: onChangeSales, data: sales, s_value: 'valueNum', s_descr: 'valueStr1',
  label: t('info.sales'), onFocus: onFocusSales, loading: loading === 'sale', classBack, classLabel, className, bStyle };
  const noatProps = { value: noat, setValue: onChangeNoat, data: noats, s_value: 'valueNum', s_descr: 'valueStr1',
  label: t('info.noat'), onFocus: onFocusNoat, loading: loading === 'noat', classBack, classLabel, className, bStyle };
  const columnProps ={ value , setValue, data : data1 , className: className1, Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon1' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] }}

  return (
    <div className={classT}>
    <div className='rp_list_filter' style={{paddingTop: 0}}>
      <div className={classH} style={{marginTop: 0}}>
        <div className='info_header_s'>
          <PlainRange {...dateProps} />
          <PlainSelect {...typeProps} />
          <PlainSelect {...subTypeProps} />
        </div>
        <div className='info_header_s1' >
          <PlainSelect {...batchProps} />
          <PlainSelect {...salesProps} />
          <PlainSelect {...noatProps} />
        </div>
      </div>
    </div>
      {/* <div className='rp_column_list_row'> */}
          <div className='rp_list_filter_icon1' style={style}><DynamicAIIcon {...searchProps} /></div>
          <div className='rp_list_filter_icon2' style={style}><IconSelect {...columnProps}/></div>
          <Search {...inputProps} />
      {/* </div> */}
    </div>
  );
}