import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { CardMain, CardInvt, CardSite } from '../../components/invt/inventory/add';

export function InventoryAdd(){
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, unit, setUnit, price, setPrice, cost, setCost, invtID, setInvtID,
    barcode, setBarcode, image, setImage };
  const invtProps = { isPack, setIsPack, isTrack, setIsTrack };
  const siteProps = { isTrack };

  return (
    <Overlay className='s_container1' loading={loading}>
      {error && <Error1 error={error} />}
      <form>
        <CardMain {...mainProps} />
        <div className='gap' />
        <CardInvt {...invtProps} />
        <div className='gap' />
        <CardSite {...siteProps} />
      </form>
    </Overlay>
  )
}