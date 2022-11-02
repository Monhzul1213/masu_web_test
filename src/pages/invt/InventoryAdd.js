import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { ButtonRow1, Error1, Overlay } from '../../components/all';
import { CardMain, CardInvt, CardSite } from '../../components/invt/inventory/add';
import { getList } from '../../services';

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
  const [sites, setSites] = useState([]);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getSites();
    setItem(null); //if edit inventory
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.map(item => item.checked = true);
      setSites(response?.data);
    }
    setLoading(false);
  }

  const onPriceChange = () => {
    setSites(old => old.map((row, index) => {
      if(!row.changed) return { ...old[index], price: price?.value };//parseFloat
      return row
    }));
  }

  const onClickCancel = () => {

  }

  const onClickSave = async () => {
    
  }

  const onClickDelete = async () => {

  }

  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, unit, setUnit, price, setPrice, cost, setCost, invtID, setInvtID,
    barcode, setBarcode, image, setImage, onPriceChange };
  const invtProps = { isPack, setIsPack, isTrack, setIsTrack };
  const siteProps = { isTrack, data: sites, setData: setSites };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true : false };

  return (
    <Overlay className='i_container' loading={loading}>
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form>
          <CardMain {...mainProps} />
          <div className='gap' />
          <CardInvt {...invtProps} />
          <div className='gap' />
          <CardSite {...siteProps} />
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}