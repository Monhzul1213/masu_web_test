import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Error1, Overlay, Prompt } from '../../../components/all';
import { Footer, Items, Main } from '../../../components/management/order/receipt';

export function OrderReceipt(){
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);
  const [disabled, setDisabled] = useState(false);
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
        order?.poOrderItems?.map(i => i.allowDecimal = i?.isEach === 'N');
        setDetail(order?.poOrderItems);
        onDone();
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

  let mainProps = { header };
  let itemsProps = { detail, setDetail, setEdited, setTotal, disabled, setDisabled };
  let footerProps = { total };
  
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
            <Footer {...footerProps} />
          </div>
        </form>
      </div>
      {/* <ButtonRow {...btnProps} /> */}
    </Overlay>
  );
}