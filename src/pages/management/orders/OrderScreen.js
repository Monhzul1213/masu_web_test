import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Menu, Header, Info, Items, Additional, Footer } from '../../../components/management/order/screen';

export function OrderScreen(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [adds, setAdds] = useState([]);
  const [searchParams] = useSearchParams();
  const [requestTime, setRequestTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [hideTime, setHideTime] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      user?.merchantId === 135 ||
      user?.merchantId === 383 ||
      user?.merchantId === 270
      )
      setHideTime(false);
    else
      setHideTime(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    let orderNo = searchParams?.get('orderNo');
    user?.msRole?.webIsReceipt !== 'Y' ? navigate({ pathname: '/' }) : getData(orderNo);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoad = () => {
    setError(null);
    setLoading(true);
  }

  const onDone = (isError, msg) => {
    setLoading(false);
    if(isError) setError(msg);
    else if(msg) message.success(msg);
  }

  const getData = async orderNo => {
    if(orderNo){
      onLoad()
      setRequestTime(new Date()); // илгээсэн цаг тэмдэглэх
      const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get?OrderNo=' + orderNo));
      if(response?.error) onDone(true, response?.error);
      else {
        let order = response?.data && response?.data[0];
        if(order){
          let total = 0;
          order?.poOrderItems?.forEach(poItem => {
            total += poItem.totalCost ?? 0;
            poItem.rowStatus = 'U';
          });
          order?.poOrderAddCosts?.forEach(addItem => {
            total += addItem.addCostAmount ?? 0;
            addItem.rowStatus = 'U';
          });
          order.poOrder.total = total;
          order.poOrder.percent = parseFloat(((order.poOrder.receivedTotalQty ?? 0) * 100 / (order.poOrder.totalQty ?? 0))?.toFixed(2));
          setOrder(order?.poOrder);
          sessionStorage.setItem('order', JSON.stringify(order));
          setItems(order?.poOrderItems);
          setAdds(order?.poOrderAddCosts);
        }
        setResponseTime(new Date()); // авсан цаг тэмдэглэх
        onDone();
      }
    }
  }

  const menuProps = { order, items, adds, onLoad, onDone, getData };
  const emptyProps = { text: '', icon: 'MdOutlineArticle' };
  const listProps = { data: items, order };
  const addProps = { data: adds };

  return (
    <div className='ps_container' style={{maxWidth, display: 'flex', flexFlow: 'row'}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='ps_back'>
            <Menu {...menuProps} size={size} />
            {!order ? <Empty1 {...emptyProps} /> :
            <div className='ps_scroll'>
              <Header {...menuProps} size={size} />
              <Info {...menuProps} size={size} />
              <Items {...listProps} size={size} />
              {adds?.length ? <Additional {...addProps} size={size} /> : null}
              <Footer total={order} />
            </div>}
          </div>
        }</SizeMe>
      </Overlay>
      {hideTime ? null : <div className="time-log" style={{ padding: '8px', fontSize: '12px', color: '#666',}}>
          {requestTime && <p>Илгээсэн цаг: {requestTime.toLocaleTimeString()}</p>}
          {responseTime && <p>Хүлээн авсан цаг: {responseTime.toLocaleTimeString()}</p>}
          {requestTime && responseTime && (
            <p>Хугацаа: {(responseTime - requestTime) / 1000} секунд</p>
          )}
      </div>}
    </div>

  );
}