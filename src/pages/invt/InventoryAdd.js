import React, { useState, useEffect } from 'react';
// import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { getList } from '../../services';
// import { getList, sendRequest } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay } from '../../components/all';
import { CardMain, CardInvt, CardSite, CardVariant, CardEmpty } from '../../components/invt/inventory/add';

export function InventoryAdd(){
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [descr, setDescr] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [isKit, setIsKit] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [sites, setSites] = useState([]);
  const [invt, setInvt] = useState(null);
  const [edited, setEdited] = useState(false);
  const [kits, setKits] = useState([]);
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSites();
    setInvt(null); //if edit inventory
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
    if(edited) setOpen(true);
    else navigate('/inventory/invt_list');
  }

  const confirm = sure => {
    setOpen(false);
    if(sure) navigate('/inventory/invt_list');
  }

  const onClickSave = async () => {
    /*
    if(name?.value){
      let newSites = [];
      sites?.forEach(s => {
        if(s?.checked){
          newSites.push({
            siteId: s.siteId,
            price: parseFloat(s.price ? s.price : 0),
            stock: parseFloat(s.stock ? s.stock : 0),
            track: parseFloat(s.track ? s.track : 0),
          });
        }
      });
      let data = {
        name: name?.value, category: category?.value, descr: descr?.value, isEach: isEach?.value,
        price: parseFloat(price?.value ? price?.value : 0), cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barcode: barcode?.value, isKit, isTrack,
        image, sites: newSites
      };
      console.log(data);
      setLoading(true);
      setError(null);
      let api = invt ? 'Inventory/UpdateInventory' : 'Inventory/AddInventory';
      const response = await dispatch(sendRequest(user, token, api, data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        message.success(t('inventory.add_success'));
        navigate('/inventory/invt_list');
      }
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
    }
    */
  }

  const onClickDelete = async () => {

  }

  const confirmProps = { open, text: t('page.back_confirm'), confirm };
  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice, cost, setCost, sku, setSku,
    barcode, setBarcode, image, setImage, onPriceChange, setEdited, isKit };
  const invtProps = { isKit, setIsKit, isTrack, setIsTrack, data: kits, setData: setKits, setError, setEdited, setCost };
  const variantProps = { data: variants, setData: setVariants, setEdited, price, cost };
  const siteProps = { isTrack, data: sites, setData: setSites, setEdited };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: invt ? true : false };

  return (
    <Overlay className='i_container' loading={loading}>
      {open && <Confirm {...confirmProps} />}
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form>
          <CardMain {...mainProps} />
          <div className='gap' />
          <CardInvt {...invtProps} />
          <div className='gap' />
          {!isKit && <CardVariant {...variantProps} />}
          {!isKit && <div className='gap' />}
          {sites?.length ? <CardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}