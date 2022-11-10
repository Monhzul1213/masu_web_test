import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { deleteRequest, getList, sendRequest } from '../../services';
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
  const [totalI, setTotalI] = useState(0);
  const [searchV, setSearchV] = useState({ value: '' });
  const [disabledV, setDisabledV] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let invtId = searchParams?.get('invtId'), response1 = false;
    let response = await getSites();
    if(response) response1 = await getModifiers();
    if(response1 && (invtId || invtId === 0)) await getInventory(invtId, response, response1);
    else {
      setSites(response);
      setModifiers(response1);
    }
  }

  const getInventory = async (value, sites1, modifiers1) => {
    setError(null);
    setLoading(true);
    let data = [{ fieldName: 'InvtID', value }];
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    setLoading(false);
    let invt = response && response?.data && response?.data[0];
    console.log(response);
    if(response?.error) setError(response?.error);
    else if(invt) {
      setInvt(invt);
      setName({ value: invt?.msInventory?.name ?? '' });
      setCategory({ value: invt?.msInventory?.categoryId ?? -1 });
      setIsEach({ value: invt?.msInventory?.isEach ?? 'Y' });
      setDescr({ value: invt?.msInventory?.descr ?? '' });
      setPrice({ value: invt?.msInventory?.price ?? 0 });
      setCost({ value: invt?.msInventory?.cost ?? 0 });
      setSku({ value: invt?.msInventory?.sku ?? '' });
      setBarcode({ value: invt?.msInventory?.barCode ?? '' });
      setIsKit(invt?.msInventory?.isKit === 'Y');
      if(invt?.msInventory?.isKit === 'Y'){
        invt?.msInvKitItems?.forEach(kit => kit.unitCost = kit.cost / kit.qty);
        setKits(invt?.msInvKitItems);
        setTotalI(invt?.msInventory?.cost ?? 0);
      } else setVariants(invt?.msInventoryVariants);
      setChecked(invt?.msInventory?.useAllSite === 'Y');
      sites1?.forEach(item => {
        let exists = invt?.psSalesPrices?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists ? true : false;
        if(exists) item.price = exists.price;
      });
      setSites(sites1);
      modifiers1.forEach(item => {
        let exists = invt?.msInventoryModifers?.filter(si => si.modifireId === item?.modifer?.modifireID)[0];
        item.checked = exists?.useModifier === 'Y';
      });
      setModifiers(modifiers1);
    }
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
      return response?.data;
    }
  }

  const getModifiers = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Inventory/GetModifer'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        if(item?.modifer?.useAllSite === 'Y') item.modifer.options = t('inventory.modifer_all');
        else {
          let options = item?.modiferSites?.map(mod => mod.name);
          item.modifer.options = options?.join(', ');
        }
      });
      return response?.data;
    }
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

  const validateData = () => {
    let invkite = [], invvar = [], invmod = [], invsales = [];
    if(name?.value && barcode?.value){
      if(isKit){
        if(kits?.length){
          kits?.forEach(item => {
            invkite.push({ invtID: item?.invtId, qty: parseFloat(item?.qty ? item?.qty : 0), cost: parseFloat(item?.cost ? item?.cost : 0) });
          });
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
            invvar.push({ variantName: item?.variantName, barCode: item?.barCode?.trim(), sku: item?.sku?.trim(),
              price: parseFloat(item?.price ? item?.price : 0), cost: parseFloat(item?.cost ? item?.cost : 0) });
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
      if(!barcode?.value) setBarcode({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    console.log(data);
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

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    setError(null);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteInventory/' + invt?.msInventory?.invtId));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        message.success(t('inventory.delete_success'));
        navigate('/inventory/invt_list');
      }
    }
  }

  const confirmProps = { open, text: t('page.back_confirm'), confirm };
  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach, price, setPrice, cost, setCost, sku, setSku,
    barcode, setBarcode, image, setImage, onPriceChange, setEdited, isKit };
  const invtProps = { isKit, setIsKit, isTrack, setIsTrack, data: kits, setData: setKits, setError, setEdited, setCost,
    search: searchI, setSearch: setSearchI, total: totalI, setTotal: setTotalI };
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