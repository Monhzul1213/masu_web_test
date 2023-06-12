import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Error1, Overlay, Prompt } from '../../../components/all';
import { Items, Main } from '../../../components/management/order/receipt';
import { ButtonRow } from '../../../components/management/order/add';

export function OrderReceipt(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [saved, setSaved] = useState(false);
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
        order?.poOrderItems?.map(i => i.allowDecimal = i?.isEach === 'N');
        setDetail(order?.poOrderItems);
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

  const validateData = status => {
    if(!disabled){
      let inReceipt = {
        receiptNo: parseInt(header?.receiptNo ? header?.receiptNo : 0),
        orderNo: parseInt(header?.orderNo),
        txnDate: moment().toISOString(),
        txnEmpCode: 0,
        vendID: header?.vendId,
        siteID: header?.siteId,
        status,
        descr: header?.notes,
        rowStatus: header?.receiptNo ? 'U' : 'I'
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
            rowStatus: item?.receiptItemID ? 'U' : 'I'
          };
          inReceiptItems?.push(newItem);
        }
      });
      return { inReceipt, inReceiptItems };
    } else
      return null;

      
  }

  const onClickSave = async status => {
    let data = validateData(status);
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Txn/ModReceiptPO', data));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('order.add_success'), header?.orderNo);
    }
  }

  let mainProps = { header };
  let itemsProps = { detail, setDetail, setEdited, total, setTotal, disabled, setDisabled };
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
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}