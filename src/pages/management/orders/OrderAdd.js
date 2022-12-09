import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import '../../../css/invt.css';
import '../../../css/order.css';
import { sendRequest } from '../../../services';
import { Error1, Overlay, Prompt } from '../../../components/all';
import { Main, Items, Additional, ButtonRow } from '../../../components/management/order/add';

export function OrderAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [vendId, setVendId] = useState({ value: null });
  const [siteId, setSiteId] = useState({ value: null });
  const [orderDate, setOrderDate] = useState({ value: moment() });
  const [reqDate, setReqDate] = useState({ value: null });
  const [notes, setNotes] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [adds, setAdds] = useState([]);
  const [dAdds, setDAdds] = useState([]);
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [order, setOrder] = useState(null);
  const [search, setSearch] = useState({ value: null });
  const [searchParams] = useSearchParams();
  const [saved, setSaved] = useState(false);
  const { user, token }  = useSelector(state => state.login);
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

  const getData = () => {
    let vendor = searchParams?.get('vendId');
    if(vendor){
      setOrder(null);
      setVendId({ value: parseInt(vendor) });
    }
  }

  const onClickCancel = () => navigate('/management/order_list');

  const validateData = status => {
    let isSiteValid = siteId?.value || siteId?.value === 0;
    let isDateValid = !reqDate?.value || reqDate?.value?.isAfter(orderDate?.value);
    if(isSiteValid && isDateValid && items?.length){
      let orderNo = order?.orderNo ?? '', itemValid = true, addValid = true;
      let orderItems = items?.map(item => {
        if(item?.orderQty){
          item.orderNo = orderNo;
          item.rowStatus = order ? 'U' : 'I';
          delete item['error'];
        } else {
          itemValid = false;
          item.error = 'orderQty'
        }
        return item;
      })
      if(!itemValid){
        setItems(orderItems);
        return false;
      }
      dItems?.forEach(it => orderItems?.push({...it, rowStatus: 'D'}));

      let orderCosts = adds?.map(item => {
        if(item?.addCostAmount && item?.addCostName){
          item.orderNo = orderNo;
          item.rowStatus = order ? 'U' : 'I';
          delete item['error'];
        } else {
          addValid = false;
          item.error = item?.addCostName ? 'addCostAmount' : 'addCostName'
        }
        return item;
      })
      if(!addValid){
        setAdds(orderCosts);
        return false;
      }
      dAdds?.forEach(it => orderCosts?.push({...it, rowStatus: 'D'}));
      let data = {
        orderNo, vendId: vendId?.value, siteId: siteId?.value, status, notes: notes?.value,
        orderDate: orderDate?.value?.format('yyyy.MM.DD'),
        reqDate: reqDate?.value ? reqDate?.value?.format('yyyy.MM.DD') : '',
        rowStatus: order ? 'U' : 'I',
        orderItems, orderCosts
      };
      return data;
    } else {
      if(!(siteId?.value || siteId?.value === 0)) setSiteId({ value: siteId?.value, error: t('error.not_empty') });
      if(reqDate?.value && reqDate?.value?.isBefore(orderDate?.value)) setReqDate({ value: reqDate?.value, error: t('error.order_date') });
      if(!items?.length) setSearch({ value: null, error: t('order.items_error') });
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

  const onClickSave = async status => {
    let data = validateData(status);
    console.log(data);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/Order', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('order.add_success'));
    }
  }

  let mainProps = { setError, setEdited, vendId, setVendId, siteId, setSiteId, orderDate, setOrderDate, reqDate, setReqDate, notes, setNotes, setLoading,
    order };
  let itemsProps = { items, setItems, setDItems, setEdited, total: total1, setTotal: setTotal1, search, setSearch };
  let addProps = { adds, setAdds, setDAdds, setEdited, total1, total2, setTotal: setTotal2 };
  let btnProps = { onClickCancel, onClickSave: () => onClickSave(1), onClickDraft: () => onClickSave(0), id: 'po_btns' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <Main {...mainProps} />
          <div className='gap' />
          <div className='po_back' id='po_back_invt'>
            <Items {...itemsProps} />
            <Additional {...addProps} />
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}

/**

  const getInventory = async (value, sites1, modifiers1) => {
    setError(null);
    setLoading(true);
    let data = [{ fieldName: 'InvtID', value }];
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    setLoading(false);
    let invt = response && response?.data && response?.data[0];
    if(response?.error) setError(response?.error);
    else if(invt) {
      setInvt(invt);
      setName({ value: invt?.msInventory?.name ?? '' });
      setCategory({ value: invt?.msInventory?.categoryId ?? -1 });
      setBuyAgeLimit({ value: invt?.msInventory?.buyAgeLimit ?? 0 })
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

  const onClickDelete = async () => {
    onLoad();
    const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteInventory/' + invt?.msInventory?.invtId));
    if(response?.error) onError(response?.error);
    else onSuccess(t('inventory.delete_success'));
  }
 */