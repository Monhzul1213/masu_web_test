import React, { useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';

import { CheckBox, Date, Input, Select, Time } from '../../../all';

function Card(props){
  const { size, setError, setEdited, name, setName, beginDate, useTime, setUseTime, setBeginDate, endDate, setEndDate, beginTime, setBeginTime,
    endTime, setEndTime, type, setType, status, setStatus } = props;
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [states, setStates] = useState([]);

  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('bonus.name'), setError, setEdited, inRow: true, length: 75 };
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true, setError, setEdited };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true, setError, setEdited };
  const timeProps = { checked: useTime, setChecked: setUseTime, label: t('bonus.use'), style: { marginTop: 15 } };
  const time1Props = {  value: beginTime, setValue: setBeginTime, label: t('bonus.begin'), inRow: true, setError, setEdited };
  const time2Props = {  value: endTime, setValue: setEndTime, label: t('bonus.end'), inRow: true, setError, setEdited };
  const typeProps = { value: type, setValue: setType, label: t('bonus.type1'), setError, setEdited, data: types, inRow: true };
  const statProps = { value: status, setValue: setStatus, label: t('bonus.status'), setError, setEdited, data: states, inRow: true };

  return (
    <div className='ia_back'>
      <Input {...nameProps}/>
      <div className='ac_row' style={{marginTop: 15}}>
        <Date {...date1Props} />
        <div className='gap' />
        <Date {...date2Props} />
      </div>
      <CheckBox {...timeProps} />
      {useTime && <div className='ac_row' style={{marginTop: 15}}>
        <Time {...time1Props} />
        <div className='gap' />
        <Time {...time2Props} />
      </div>}
      <div id={idRow} style={{marginTop: 15}}>
        <Select {...typeProps} />
        <div className='gap' />
        <Select {...statProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);

/**
comment
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { limitList, timeList1 } from '../../../../helpers';
import { getList } from '../../../../services';
import { CheckBox, DescrInput, DynamicBSIcon, Input, MoneyInput, Radio, Select, UploadImage, IconButton } from '../../../all';
import { Add as AddCategory } from '../../category';
import { Add as AddVendor } from '../../../management/vendor';
import { SelectableCell1 } from './EditableCell1';
import { ValidateInput } from '../../../../src1/components/all/all_m';

function Card(props){
  const { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice,
    cost, setCost, sku, setSku, barcode, setBarcode, image, setImage, setImage64, setImageType, onPriceChange,
    setEdited, isKit, size, buyAgeLimit, setBuyAgeLimit, vendId, setVendId, setLoading, isService, setIsService, time, setTime, batch, setBatch } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const [vendors, setVendors] = useState([]);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [vendorVisible, setVendorVisible] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    let response = await getVendors();
    if(response) await getCategories();
    setLoading(false);
  }

  const getCategories = async (toGet, id) => {
    if(!categories?.length || categories?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
        setCategories(data);
        if(id) setCategory({ value: id });
      }
    }
  }

  const getVendors = async id => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setVendors(response?.data);
      if(id) setVendId({ value: id });
      return true;
    }
  }

  const changeBarcode = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setBarcode({...value, error: 'must_number'});
    else setBarcode({ value: text });
  } 

  const onClickCategory = e => {
    e?.preventDefault();
    setCategoryVisible(true);
  }

  const closeCategory = (saved, id) => {
    setCategoryVisible(false);
    getCategories(saved, id);
  }

  const onClickVendor = e => {
    e?.preventDefault();
    setVendorVisible(true);
  }

  const closeVendor = (saved, id) => {
    setVendorVisible(false);
    if(saved) getVendors(id);
  }

  const changeBatch = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setBatch({...value, error: 'must_number'});
    else setBatch({ value: text });
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  // const idRow1 = size?.width > 540 ? 'im_unit_row_large' : 'im_unit_row_small';
  const idRow2 = size?.width > 540 ? 'tm_unit_row_large' : 'tm_unit_row_small';

  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, setEdited, inRow: false,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName', onFocus: getCategories };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setEdited, setError, length: 500 };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('inventory.unit'), data: t('inventory.units'),
    setEdited, setError, inRow: false, className : 'radio_back_dis' };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setEdited, setError,
    inRow: true, onBlur: onPriceChange };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setEdited, setError, inRow: true,
    disabled: isKit };
  const skuProps = { value: sku, setValue: setSku, label: t('inventory.sku'), placeholder: t('inventory.sku'), setEdited, setError, inRow: true, length: 30 };
  const barcodeProps = { value: barcode, setValue: changeBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setEdited, setError,
    inRow: true, length: 30 };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image' };
  const vendProps = { value: vendId, setValue: setVendId, label: t('inventory.vendor'), setError, setEdited, data: vendors, inRow: true,
    s_value: 'vendId', s_descr: 'vendName', placeholder: t('inventory.vendor') };
  const serviceProps = { label: t('inventory.service'), checked: isService, setChecked: setIsService , style: {width: '50%'}};
  const timeProps = { data: timeList1, value: time, setValue: setTime, label: t('timetable.service_time') };
  const batchProps = { value: batch, setValue: changeBatch, label: t('order.t_batch'), placeholder: t('order.t_batch'), setError, setEdited, className: 'invt_back', inRow: true};

  return (
    
  );
}


 */