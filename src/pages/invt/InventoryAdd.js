import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay } from '../../components/all';
import { CardMain, CardInvt, CardSite, CardVariant, CardEmpty, CardModifier } from '../../components/invt/inventory/add';

export function InventoryAdd(){
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [descr, setDescr] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [image, setImage] = useState('');
  const [isKit, setIsKit] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [sites, setSites] = useState([]);
  const [invt, setInvt] = useState(null);
  const [edited, setEdited] = useState(false);
  const [kits, setKits] = useState([]);
  const [variants, setVariants] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [searchI, setSearchI] = useState({ value: null });
  const [searchV, setSearchV] = useState({ value: '' });
  const [disabledV, setDisabledV] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let response = await getSites();
    if(response) await getModifiers();
  }

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.map(item => item.checked = true);
      setSites(response?.data);
      return true;
    }
  }

  const getModifiers = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Inventory/GetModifer'));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        // item?.modiferSites?.forEach(sit => {

        // });
        let options = item?.modiferItems?.map(mod => mod.optionName);
        item.modifer.options = options?.join(', ');
      });
      setModifiers(response?.data);
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

  const validateData = () => {
    let invkite = [], invvar = [], invmod = [], invsales = [];
    if(name?.value){
      if(isKit){
        if(kits?.length){
          //parsefloat
          //"invkite": [ { "invtID": 0, "qty": 0, "cost": 0 } ]
        } else {
          setSearchI({ value: searchI?.value, error: t('inventory.kit_error') });
          return false;
        }
      } else {
        if(disabledV){
          setSearchV({ value: searchV?.value, error: t('inventory.variant_error1') });
          return false;
        } else {
          variants?.forEach(item => {
            invvar.push({ variantName: item?.VariantName, barCode: item?.Barcode?.trim(), sku: item?.Sku?.trim(),
              price: parseFloat(item?.Price ? item?.Price : 0), cost: parseFloat(item?.Cost ? item?.Cost : 0) });
          });
        }
      }
      modifiers?.forEach(item => {
        if(item?.checked) invmod.push({ modifireID: item?.modifer?.modifireID, useModifier: 'Y' });
      });
      sites?.forEach(item => {
        if(item?.checked) invsales.push({ siteID: item?.siteId, price: parseFloat(item?.price ? item?.price : 0), status: 0 });//status?
      });
      let data = {
        name: name?.value, categoryID: category?.value, descr: descr?.value, isEach: isEach?.value,
        price: parseFloat(price?.value ? price?.value : 0),
        cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barCode: barcode?.value, isKit: isKit ? 'Y' : 'N', isTrackStock: isTrack ? 'Y' : 'N',
        UseAllSite: checked ? 'Y' : 'N', image,
        invkite, invvar, invmod, invsales
      };
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
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
    }
  }

  const onClickDelete = async () => {

  }

  const confirmProps = { open, text: t('page.back_confirm'), confirm };
  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice, cost, setCost, sku, setSku,
    barcode, setBarcode, image, setImage, onPriceChange, setEdited, isKit };
  const invtProps = { isKit, setIsKit, isTrack, setIsTrack, data: kits, setData: setKits, setError, setEdited, setCost,
    search: searchI, setSearch: setSearchI };
  const variantProps = { data: variants, setData: setVariants, setEdited, price, cost,
    search: searchV, setSearch: setSearchV, disabled: disabledV, setDisabled: setDisabledV };
  const siteProps = { isTrack, data: sites, setData: setSites, setEdited, checked, setChecked };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add' };
  const modiProps = { data: modifiers, setData: setModifiers, setEdited };
  const modiEmptyProps = { title: 'modifier.title', icon: 'MdStorefront', route: '/inventory/invt_modi', btn: 'modifier.add' };
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
          <div className='gap' />
          {modifiers?.length ? <CardModifier {...modiProps} /> : <CardEmpty {...modiEmptyProps} />}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}