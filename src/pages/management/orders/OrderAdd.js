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

  const getData = async () => {
    let vendor = searchParams?.get('vendId');
    if(vendor){
      setOrder(null);
      setVendId({ value: parseInt(vendor) });
      getItems(vendor);
    }
  }

  const getItems = async vendor => {
    setError(null);
    setLoading(false);
    let filter = [{fieldName: "VendID", value: vendor}]
    const response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
    } else {
      let items = response?.data?.map(item => {
        let invt = item?.msInventory;
        return { orderItemId: -1, invtId: invt?.invtId, name: invt?.name, orderQty: 0, totalCost: 0, cost: invt?.cost, siteQty: 0, transitQty: 0,
          invtCode: '', rowStatus: 'I', sku: invt?.sku };
      });
      setItems(items);
    }
  }

  const onClickCancel = () => navigate('/management/order_list');

  const validateData = status => {
    let isSiteValid = siteId?.value || siteId?.value === 0;
    let isDateValid = !reqDate?.value || reqDate?.value?.isAfter(orderDate?.value);
    let length = items?.filter(item => item?.orderQty)?.length;
    if(isSiteValid && isDateValid && length){
      let orderNo = order?.orderNo ?? '', orderItems = [], addValid = true;
      items?.forEach(item => {
        if(item?.orderQty){
          item.orderNo = orderNo;
          item.rowStatus = order ? 'U' : 'I';
          delete item['error'];
          orderItems.push(item);
        }
      })
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
      if(!length) setSearch({ value: null, error: t('order.items_error') });
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