import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';
import { limitList } from '../../../../helpers';

import { getList } from '../../../../services';
import { DescrInput, Input, MoneyInput, Radio, Select, UploadImage } from '../../../all';

function Card(props){
  const { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice, cost, setCost, sku, setSku,
    barcode, setBarcode, image, setImage, setImage64, setImageType, onPriceChange, setEdited, isKit, size, buyAgeLimit, setBuyAgeLimit, vendId, setVendId
  } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let response = await getVendors();
    if(response) await getCategories();
  }

  const getCategories = async () => {
    if(!categories?.length || categories?.length === 1){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
        setCategories(data);
      }
      setLoading(false);
    }
  }

  const getVendors = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setVendors(response?.data);
      return true;
    }
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, setEdited, inRow: true, length: 30 };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, setEdited, inRow: false,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName', onFocus: getCategories, loading };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setEdited, setError, length: 30 };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('inventory.unit'), data: t('inventory.units'), setEdited, setError };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setEdited, setError,
    inRow: true, onBlur: onPriceChange };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setEdited, setError, inRow: true,
    disabled: isKit };
  const skuProps = { value: sku, setValue: setSku, label: t('inventory.sku'), placeholder: t('inventory.sku'), setEdited, setError, inRow: true, length: 30 };
  const barcodeProps = { value: barcode, setValue: setBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setEdited, setError,
    inRow: true, length: 30 };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image' };
  const limitProps = { value: buyAgeLimit, setValue: setBuyAgeLimit, label: t('inventory.limit'), setError, setEdited, data: limitList, inRow: true };
  const vendProps = { value: vendId, setValue: setVendId, label: t('inventory.vendor'), setError, setEdited, data: vendors, inRow: true,
    s_value: 'vendId', s_descr: 'vendName', placeholder: t('inventory.vendor') };
  
  return (
    <div className='ia_back' id={id}>
      <div className='ia_image_row'>
        <div style={{flex: 1}}>
          <Input {...nameProps} />
          <Select {...categoryProps} />
          <Radio {...unitProps} />
        </div>
        <div className='gap' />
        <UploadImage {...imageProps} />
      </div>
      <DescrInput {...descrProps} />
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
        <Select {...vendProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const CardMain = withSizeHOC(Card);