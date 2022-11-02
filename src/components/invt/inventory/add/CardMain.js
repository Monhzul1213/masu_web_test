import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { DescrInput, Input, MoneyInput, Radio, Select, UploadImage } from '../../../all';

export function CardMain(props){
  const { setError, name, setName, category, setCategory, descr, setDescr, unit, setUnit, price, setPrice, cost, setCost, invtID, setInvtID,
    barcode, setBarcode, image, setImage, onPriceChange } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

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

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, inRow: true };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, inRow: false,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName', onFocus, loading };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setError };
  const unitProps = { value: unit, setValue: setUnit, label: t('inventory.unit'), data: t('inventory.units'), setError };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setError, inRow: true,
    onBlur: onPriceChange };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setError, inRow: true };
  const skuProps = { value: invtID, setValue: setInvtID, label: t('inventory.sku'), placeholder: t('inventory.sku'), setError, inRow: true };
  const barcodeProps = { value: barcode, setValue: setBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setError, inRow: true };
  const imageProps = { image, setImage };
  
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