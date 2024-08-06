import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import mime from 'mime';
import moment from 'moment';

import '../../css/invt.css';
import { urlToFile } from '../../helpers';
import { deleteRequest, getList, sendRequest } from '../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { CardMain, CardInvt, CardSite, CardVariant, CardEmpty, CardModifier } from '../../components/invt/inventory/add';

export function InventoryAdd(){
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [descr, setDescr] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [isService, setIsService] = useState(false);
  const [price, setPrice] = useState({ value: '' });
  const [batch, setBatch] = useState({ value: '' });
  const [time, setTime] = useState({ value: '01:00' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [buyAgeLimit, setBuyAgeLimit] = useState({ value: 0 });
  const [vendId, setVendId] = useState({ value: null });
  const [isKit, setIsKit] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [sites, setSites] = useState([]);
  const [invt, setInvt] = useState(null);
  const [edited, setEdited] = useState(false);
  const [kits, setKits] = useState([]);
  const [dkits, setDKits] = useState([]);
  const [variants, setVariants] = useState([]);
  const [dvariants, setDVariants] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState(true);
  const [searchI, setSearchI] = useState({ value: null });
  const [totalI, setTotalI] = useState(0);
  const [searchV, setSearchV] = useState({ value: '' });
  const [disabledV, setDisabledV] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const getData = async () => {
    setLoaded(true);
    let invtId = searchParams?.get('invtId'), response1 = false;
    let response = await getSites();
    if(response) response1 = await getModifiers();
    if(response1 && (invtId || invtId === 0)) await getInventory(invtId, response, response1);
    else {
      setSites(response);
      setModifiers(response1);
      let vendor = searchParams?.get('vendId');
      if(vendor) setVendId({ value: parseInt(vendor) });
    }
    setLoaded(false);
  }

  const getImage = async inventory => {
    if(inventory?.fileRaw?.fileData){
      let type = inventory?.fileRaw?.fileType?.replace('.', '');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${inventory?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }

  const toHours = (totalMinutes) => {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);  
    setTime({value: `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`});
  }

  const getInventory = async (value, sites1, modifiers1) => {
    setError(null);
    let data = [{ fieldName: 'InvtID', value }];
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    let invt = response && response?.data && response?.data[0];
    if(response?.error) setError(response?.error);
    else if(invt) {
      setInvt(invt);
      setBatch({ value: invt?.msInventory?.batchQty ?? '' })
      setName({ value: invt?.msInventory?.name ?? '' });
      setCategory({ value: invt?.msInventory?.categoryId ?? -1 });
      setBuyAgeLimit({ value: invt?.msInventory?.buyAgeLimit ?? 0 })
      if(invt?.msInventory?.vendID !== -1) setVendId({ value: invt?.msInventory?.vendID })
      setIsEach({ value: invt?.msInventory?.isEach ?? 'Y' });
      setIsService(invt?.msInventory?.isService === 'Y')
      toHours(invt?.msInventory?.serviceTime)
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
        if(exists){
          item.price = exists.price;
          item.useNhat = exists.useNhat;
          item.useSalesPrice = exists.useSalesPrice;
          item.salesPrice = exists.salesPrice;
          item.salesBeginDate = exists.salesBeginDate;
          item.salesEndDate = exists.salesEndDate;
          item.salesTimeLimited = exists.salesTimeLimited;
          item.salesBeginTime = exists.salesBeginTime;
          item.salesEndTime = exists.salesEndTime;
          if(exists.useSalesPrice === 'Y'){
            item.salesLabel = moment(exists.salesBeginDate).format('yyyy.MM.DD')
              + '-' + moment(exists.salesEndDate).format('MM.DD');
            if(exists.salesTimeLimited === 'Y') item.salesLabel1 = exists.salesBeginTime + '-' + exists.salesEndTime;
          }
          item.useWholePrice = exists.useWholePrice;
          item.wholePrice = exists.wholePrice;
          item.wholeQty = exists.wholeQty;
        }
        item.rowStatus = exists ? 'U' : 'I';
      });
      setSites(sites1);
      modifiers1.forEach(item => {
        let exists = invt?.msInventoryModifers?.filter(si => si.modifireId === item?.modifer?.modifireID)[0];
        item.checked = exists?.useModifier === 'Y';
        item.rowStatus = exists ? 'U' : 'I';
      });
      setModifiers(modifiers1);
      getImage(invt?.msInventory);
    }
  }

  const getSites = async () => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
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
    const response = await dispatch(getList(user, token, 'Inventory/GetModifer'));
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        if(item?.modifer?.useAllSite === 'Y') item.modifer.options = t('inventory.modifer_all');
        else {
          let options = item?.modiferSites?.map(mod => mod.siteName);
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

  const onClickCancel = () => navigate('/inventory/invt_list');

  const validateData = () => {
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    let invkite = [], invvar = [], invmod = [], invsales = [];
    let [hours, minutes] = time?.value?.replace(/-/g, '0').split(':');
    let totalSeconds = (+hours) * 60 + (+minutes) ;
    if(isNameValid && barcode?.value){
      if(isKit){
        if(kits?.length){
          kits?.forEach(item => {
            invkite.push({ invtID: item?.invtId, qty: parseFloat(item?.qty ? item?.qty : 0), cost: parseFloat(item?.cost ? item?.cost : 0),
              rowStatus: item?.kitId || item?.kitId === 0 ? 'U' : 'I' });
          });
          dkits?.forEach(it => invkite?.push({...it, rowStatus: 'D'}));
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
            let varItem = { variantName: item?.variantName, barCode: item?.barCode?.trim(), sku: item?.sku?.trim(),
              price: parseFloat(item?.price ? item?.price : 0), cost: parseFloat(item?.cost ? item?.cost : 0) };
            if(invt){
              varItem.variantID = item?.variantId ?? -1;
              varItem.rowStatus = item?.variantId || item?.variantId === 0 ? 'U' : 'I';
            }
            invvar.push(varItem);
          });
          dvariants?.forEach(it => invvar?.push({...it, rowStatus: 'D'}));
        }
      }
      modifiers?.forEach(item => {
        if(item?.checked) invmod.push({ modifireID: item?.modifer?.modifireID, useModifier: 'Y', rowStatus: item?.rowStatus ?? 'I' });
        else if(item?.rowStatus === 'U') invmod.push({ modifireID: item?.modifer?.modifireID, useModifier: 'N', rowStatus: 'D' });
      });
      sites?.forEach(item => {
        if(item?.checked)
          invsales.push({
            siteID: item?.siteId, price: parseFloat(item?.price ? item?.price : 0),
            status: 0, rowStatus: item?.rowStatus ?? 'I', useNhat: item?.useNhat ?? 'N' });
        else if(item?.rowStatus === 'U')
          invsales.push({
            siteID: item?.siteId, price: parseFloat(item?.price ? item?.price : 0),
            status: 0, rowStatus: 'D', useNhat: item?.useNhat ?? 'N' });
      });
      let data = {
        name: name?.value, categoryID: category?.value, descr: descr?.value, isEach: isEach?.value,
        buyAgeLimit: buyAgeLimit?.value,
        vendID: vendId?.value ?? -1, vendInvtID: invt?.vendInvtID ?? '', vendUnitID: invt?.vendUnitID ?? '',
        price: parseFloat(price?.value ? price?.value : 0),
        cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barCode: barcode?.value, isKit: isKit ? 'Y' : 'N', isTrackStock: isTrack ? 'Y' : 'N',
        UseAllSite: checked ? 'Y' : 'N',
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        isService: isService ? 'Y' : 'N', serviceTime: totalSeconds,
        rowStatus: invt ? 'U' : 'I', batchQty: batch?.value,
        invkite, invvar, invmod, invsales
      };
      if(invt){
        data.invtID = invt?.msInventory?.invtId;
        data.useAllSite = checked ? 'Y' : 'N';
      }
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!barcode?.value) setBarcode({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = err => {
    setError(err);
    setEdited(true);
    setLoading(false);
  }

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      let api = invt ? 'Inventory/UpdateInventory' : 'Inventory/AddInventory';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('inventory.add_success'));
    }
  }

  const onClickDelete = async () => {
    onLoad();
    const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteInventory/' + invt?.msInventory?.invtId));
    if(response?.error) onError(response?.error);
    else onSuccess(t('inventory.delete_success'));
  }

  const mainProps = { setError, name, setName, category, setCategory, descr, setDescr, isEach, setIsEach,
    price, setPrice, cost, setCost, sku, setSku, setLoading, barcode, setBarcode, image, setImage, setImage64,
    setImageType, onPriceChange, setEdited, isKit, image64, buyAgeLimit, setBuyAgeLimit, vendId, setVendId,
    isService, setIsService, time, setTime, batch, setBatch };
  const invtProps = { isKit, setIsKit, isTrack, setIsTrack, data: kits, setData: setKits, setError, setEdited, setCost, setDKits,
    search: searchI, setSearch: setSearchI, total: totalI, setTotal: setTotalI };
  const variantProps = { data: variants, setData: setVariants, setEdited, price, cost, setDVariants,
    search: searchV, setSearch: setSearchV, disabled: disabledV, setDisabled: setDisabledV };
  const siteProps = { isTrack, data: sites, setData: setSites, setEdited, checked, setChecked };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add' };
  const modiProps = { data: modifiers, setData: setModifiers, setEdited };
  const modiEmptyProps = { title: 'modifier.title', icon: 'MdStorefront', route: '/inventory/invt_modi', btn: 'modifier.add' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: invt ? true : false };

  return (
    <Overlay className='i_container' loading={loading || loaded}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
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
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  )
}