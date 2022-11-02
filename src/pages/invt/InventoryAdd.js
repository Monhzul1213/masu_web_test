import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { getList } from '../../services';
import { Error1, Input, MoneyInput, Overlay, Select, DescrInput, Radio, UploadImage } from '../../components/all';
import { SwitchLabel } from '../../components/invt/inventory/add';

export function InventoryAdd(){
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [categories, setCategories] = useState([]);
  const [descr, setDescr] = useState({ value: '' });
  const [unit, setUnit] = useState({ value: null });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [invtID, setInvtID] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [isPack, setIsPack] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getCategories();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategories = async () => {
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

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError, inRow: true };
  const categoryProps = { value: category, setValue: setCategory, label: t('inventory.category'), setError, inRow: false,
    data: categories, s_value: 'categoryId', s_descr: 'categoryName' };
  const descrProps = { value: descr, setValue: setDescr, label: t('inventory.descr1'), placeholder: t('inventory.descr1'), setError };
  const unitProps = { value: unit, setValue: setUnit, label: t('inventory.unit'), data: t('inventory.units'), setError };
  const priceProps = { value: price, setValue: setPrice, label: t('inventory.price'), placeholder: t('inventory.price'), setError, inRow: true };
  const costProps = { value: cost, setValue: setCost, label: t('inventory.cost'), placeholder: t('inventory.cost'), setError, inRow: true };
  const skuProps = { value: invtID, setValue: setInvtID, label: t('inventory.sku'), placeholder: t('inventory.sku'), setError, inRow: true };
  const barcodeProps = { value: barcode, setValue: setBarcode, label: t('inventory.barcode'), placeholder: t('inventory.barcode'), setError, inRow: true };
  const imageProps = { image, setImage };
  const isPackProps = { value: isPack, setValue: setIsPack, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };

  return (
    <Overlay className='s_container1' loading={loading}>
      {error && <Error1 error={error} />}
      <form>
        <div className='ac_back'>
          <div className='ac_row'>
            <div style={{flex: 1}}>
              <Input {...nameProps} />
              <Select {...categoryProps} />
            </div>
            <div className='gap' />
            <UploadImage {...imageProps} />
          </div>
          <DescrInput {...descrProps} />
          <Radio {...unitProps} />
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
        <div className='gap' />
        <div className='ac_back'>
          <p className='ac_title'>{t('inventory.title')}</p>
          <SwitchLabel {...isPackProps} />
          {!isPack && <SwitchLabel {...isTrackProps} />}
        </div>
        <div className='gap' />
        <div className='ac_back'>
          <p className='ac_title'>{t('inventory.sites')}</p>
        </div>
      </form>
    </Overlay>
  )
}