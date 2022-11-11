import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { DescrInput, Input, MoneyInput, Radio, Select, UploadImage } from '../../../all';

export function CardMain(props){
  const { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice, cost, setCost, sku, setSku,
    barcode, setBarcode, image, setImage, setImage64, setImageType, onPriceChange, setEdited, isKit } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = async () => {
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

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, setEdited, inRow: true, length: 30 };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, setEdited, inRow: false,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName', onFocus, loading };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setEdited, setError, length: 30 };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('inventory.unit'), data: t('inventory.units'), setEdited, setError };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setEdited, setError,
    inRow: true, onBlur: onPriceChange };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setEdited, setError, inRow: true,
    disabled: isKit };
  const skuProps = { value: sku, setValue: setSku, label: t('inventory.sku'), placeholder: t('inventory.sku'), setEdited, setError, inRow: true, length: 30 };
  const barcodeProps = { value: barcode, setValue: setBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setEdited, setError,
    inRow: true, length: 30 };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError };
  
  return (
    <div className='ac_back'>
      <div className='ac_row'>
        <div style={{flex: 1}}>
          <Input {...nameProps} />
          <Select {...categoryProps} />
          <Radio {...unitProps} />
        </div>
        <div className='gap' />
        <UploadImage {...imageProps} />
      </div>
      <DescrInput {...descrProps} />
      <div className='ac_row' style={{marginTop: 10}}>
        <MoneyInput {...priceProps} />
        <div className='gap' />
        <MoneyInput {...costProps} />
      </div>
      <div className='ac_row' style={{marginTop: 10}}>
        <Input {...skuProps} />
        <div className='gap' />
        <Input {...barcodeProps} />
      </div>
    </div>
  );
}