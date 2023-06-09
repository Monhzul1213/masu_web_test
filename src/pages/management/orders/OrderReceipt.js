import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Error1, Overlay, Prompt } from '../../../components/all';

export function OrderReceipt(){
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
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

  const getData = async orderNo => {
    if(orderNo){
      onLoad()
      const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get?OrderNo=' + orderNo));
      if(response?.error) onDone(true, response?.error);
      else {
        let order = response?.data && response?.data[0];
        setHeader(order?.poOrder);
        setDetail(order?.poOrderItems);
        onDone();
      //   if(order){
      //     let total = 0;
      //     order?.poOrderItems?.forEach(poItem => {
      //       total += poItem.totalCost ?? 0;
      //       poItem.rowStatus = 'U';
      //     });
      //     order?.poOrderAddCosts?.forEach(addItem => {
      //       total += addItem.addCostAmount ?? 0;
      //       addItem.rowStatus = 'U';
      //     });
      //     order.poOrder.total = total;
      //     order.poOrder.percent = parseFloat(((order.poOrder.receivedTotalQty ?? 0) * 100 / (order.poOrder.totalQty ?? 0))?.toFixed(2));
      //     setOrder(order?.poOrder);
      //     sessionStorage.setItem('order', JSON.stringify(order));
      //     setItems(order?.poOrderItems);
      //     setAdds(order?.poOrderAddCosts);
      //   }
      }
    }
  }

  const onLoad = () => {
    setError(null);
    setLoading(true);
  }

  const onDone = (isError, msg) => {
    setLoading(false);
    if(isError) setError(msg);
    else if(msg) message.success(msg);
  }
  
  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          {/*
          <Main {...mainProps} />
          <div className='gap' />
          <div className='po_back' id='po_back_invt'>
            <Items {...itemsProps} />
            <Additional {...addProps} />
          </div> */}
        </form>
      </div>
      {/* <ButtonRow {...btnProps} /> */}
    </Overlay>
  );
}