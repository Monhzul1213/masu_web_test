import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { Error1, Overlay, CheckAll } from '../../components/all';
import { SwitchLabel, CardMain } from '../../components/invt/inventory/add';

export function InventoryAdd(){
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [descr, setDescr] = useState({ value: '' });
  const [unit, setUnit] = useState({ value: null });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [invtID, setInvtID] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [isPack, setIsPack] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [checkedAll, setCheckedAll] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheckAll = checked => {
    setCheckedAll(checked);
  }

  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, unit, setUnit, price, setPrice, cost, setCost, invtID, setInvtID,
    barcode, setBarcode, image, setImage };
  const isPackProps = { value: isPack, setValue: setIsPack, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
  const checkProps = { type: 'inventory', checked: checkedAll, onCheckAll, style: {border: 'none'} };

  return (
    <Overlay className='s_container1' loading={loading}>
      {error && <Error1 error={error} />}
      <form>
        <CardMain {...mainProps} />
        <div className='gap' />
        <div className='ac_back'>
          <p className='ac_title'>{t('inventory.title')}</p>
          <SwitchLabel {...isPackProps} />
          {!isPack && <SwitchLabel {...isTrackProps} />}
        </div>
        <div className='gap' />
        <div className='ac_back'>
          <p className='ac_title'>{t('inventory.sites')}</p>
          <div style={{padding: 5}} />
          <CheckAll {...checkProps} />
        </div>
      </form>
    </Overlay>
  )
}