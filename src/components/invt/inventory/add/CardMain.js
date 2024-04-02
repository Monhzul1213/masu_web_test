import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

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
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  // const idRow1 = size?.width > 540 ? 'im_unit_row_large' : 'im_unit_row_small';
  const idRow2 = size?.width > 540 ? 'tm_unit_row_large' : 'tm_unit_row_small';

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, setEdited, inRow: true, length: 75 };
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
  const limitProps = { value: buyAgeLimit, setValue: setBuyAgeLimit, label: t('inventory.limit'), setError, setEdited, data: limitList, inRow: true };
  const vendProps = { value: vendId, setValue: setVendId, label: t('inventory.vendor'), setError, setEdited, data: vendors, inRow: true,
    s_value: 'vendId', s_descr: 'vendName', placeholder: t('inventory.vendor') };
  const serviceProps = { label: t('inventory.service'), checked: isService, setChecked: setIsService , style: {width: '50%'}};
  const timeProps = { data: timeList1, value: time, setValue: setTime, label: t('timetable.service_time') };
  const batchProps = { value: batch, setValue: changeBatch, label: t('order.t_batch'), placeholder: t('order.t_batch'), setError, setEdited, className: 'invt_back'};

  return (
    <div className='ia_back' id={id}>
      {categoryVisible && <AddCategory visible={categoryVisible} closeModal={closeCategory} />}
      {vendorVisible && <AddVendor visible={vendorVisible} closeModal={closeVendor} />}
      <div className='ia_image_row'>
        <div style={{flex: 1}}>
          <Input {...nameProps} />
          <div id='im_unit_row_large'>
            <div style={{flex: 1}}><Select {...categoryProps} /></div>
            <IconButton className='im_add_btn' onClick={onClickCategory} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
          </div>
          <div id={idRow}>
            <Radio {...unitProps} />
            <div className='gap'/>
            <ValidateInput {...batchProps} />
          </div>
          <div id={idRow2}>
            <CheckBox {...serviceProps} />
            {isService ? <SelectableCell1 {...timeProps}/> : ''}
          </div>
        </div>
        <div className='gap' />
        <UploadImage {...imageProps} />
      </div>
      <DescrInput {...descrProps} id='m_input_descr1' />
      <div id={idRow}>
        <MoneyInput {...priceProps} />
        <div className='im_gap' />
        <MoneyInput {...costProps} />
      </div>
      <div id={idRow}>
        <Input {...skuProps} />
        <div className='im_gap' />
        <Input {...barcodeProps} />
      </div>
      <div id={idRow}>
        <Select {...limitProps} />
        <div className='im_gap' />
        <div className='im_vend_row'>
          <Select {...vendProps} />
          <IconButton className='im_add_btn' onClick={onClickVendor} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
        </div>
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const CardMain = withSizeHOC(Card);