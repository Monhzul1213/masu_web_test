import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { add, divide } from '../../../helpers';
import { Confirm, Error1, Overlay, Prompt } from '../../../components/all';
import { Items, Main } from '../../../components/management/order/receipt';
import { ButtonRow } from '../../../components/management/order/add';
import { Subscription } from '../../../components/management/adjust/list';

export function OrderReceipt(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [notes, setNotes] = useState({ value: '' });
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [status1, setStatus] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let orderNo = searchParams?.get('orderNo');
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData(orderNo);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) navigate({ pathname: '/management/order_list/order', search: createSearchParams({ orderNo: saved }).toString() });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const getData = async orderNo => {
    if(orderNo){
      onLoad()
      const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get?OrderNo=' + orderNo));
      if(response?.error) onDone(true, response?.error);
      else {
        let order = response?.data && response?.data[0];
        setHeader(order?.poOrder);
        let total = order?.poOrder?.receivedTotalCost;
        let discount = divide(divide(total, 100), order?.poOrder?.discountPercent, true);
        let left = add(total, discount, true);
        setTotal({ total, discount, left });
        order?.poOrderItems?.map(i => i.allowDecimal = i?.isEach === 'N');
        setDetail(order?.poOrderItems);
        setDeletable(order?.poOrder?.status === 1 && order?.poOrder?.receiptNo);
        setNotes({ value: order?.poOrder?.notes ?? '' });
        onDone();
      }
    }
  }

  const onLoad = () => {
    setEdited(false);
    setError(null);
    setLoading(true);
  }

  const onDone = (isError, msg) => {
    setLoading(false);
    if(isError) setError(msg);
    else if(msg) message.success(msg);
  }

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
    setLoading(false);
  }

  const onSuccess = (msg, orderNo) => {
    message.success(msg);
    setSaved(orderNo);
    setLoading(false);
  }

  const onClickCancel = () => {
      navigate({ pathname: '/management/order_list/order', search: createSearchParams({ orderNo: header?.orderNo }).toString() })
  }

  const validateData = (status, deleting) => {
    if(!disabled || deleting){
      let inReceipt = {
        receiptNo: parseInt(header?.receiptNo ? header?.receiptNo : 0),
        orderNo: parseInt(header?.orderNo),
        txnDate: moment().toISOString(),
        txnEmpCode: 0,
        vendID: header?.vendId,
        siteID: header?.siteId,
        status,
        descr: notes?.value,
        rowStatus: deleting ? 'D' : header?.receiptNo ? 'U' : 'I'
      };
      let inReceiptItems = [];
      detail?.map(item => {
        let qty = parseFloat(item?.receivedQty ? item?.receivedQty : 0);
        if(qty){
          let newItem = {
            receiptItemID: parseInt(item?.receiptItemID ? item?.receiptItemID : 0),
            sourceItemID: item?.orderItemId,
            invtID: item?.invtId,
            qty: parseFloat(item?.receivedQty ? item?.receivedQty : 0),
            cost: parseFloat(item?.cost ? item?.cost : 0),
            totalCost: parseFloat(item?.receivedTotalCost ? item?.receivedTotalCost : 0),
            amount: parseFloat(item?.cost ? item?.cost : 0),
            totalAmount: parseFloat(item?.receivedTotalCost ? item?.receivedTotalCost : 0),
            notes: '',
            expireDate: moment().toISOString(),
            rowStatus: deleting ? 'D' : item?.receiptItemID ? 'U' : 'I'
          };
          inReceiptItems?.push(newItem);
        }
      });
      if(inReceiptItems?.length === 0){
        setError(t('order.receipt_error'));
        return null;    
      } else 
        return { inReceipt, inReceiptItems };
    } else
      return null;
  }

  const onClickSave = async status => {
    let data = validateData(status);
    if(data){
      setStatus(status);
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModReceiptPO', data));
      if(response?.code === 1001){
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      }
      else if(response?.error) onError(response?.error, true);
      else onSuccess(t('order.order_success'), header?.orderNo);
    }
  }
  
  const onClickDelete = async () => {
    let data = validateData(0, true);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModReceiptPO', data));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('order.order_delete_success'), header?.orderNo);
    }
  }

  const onDone1 = async () => {
    setVisible(false);
    setSites([]);
    // onClickSave(status1);
  }

  const confirm = sure => {
    setOpen(false);
    setError(null);
    if(sure) setVisible(true);
  }

  let mainProps = { header, notes, setNotes, setEdited };
  let itemsProps = { header, detail, setDetail, setEdited, setErrorMain: setError, total, setTotal, disabled, setDisabled };
  let btnProps = { onClickCancel, onClickSave: () => onClickSave(1), onClickDraft: () => onClickSave(0), id: 'po_btns',
    text3: 'order.receipt_save', deletable, onClickDelete };
  let subProps = { visible, setVisible, sites, setSites, onDone: onDone1, noTrial: true, noBack: true };
  let confirmProps = { open, text: t('adjust.confirm_pay'), confirm, text1: error };
  
  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {visible && <Subscription {...subProps} />}
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <Main {...mainProps} />
          <div className='gap' />
          <div className='po_back' id='po_back_invt'>
            <Items {...itemsProps} />
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}