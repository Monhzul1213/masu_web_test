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
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let orderNo = searchParams?.get('orderNo');
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData(orderNo);
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
        onDone();
      }
    }
  }

  const menuProps = { order, items, adds, onLoad, onDone, getData };
  const emptyProps = { text: '', icon: 'MdOutlineArticle' };
  const listProps = { data: items, order };
  const addProps = { data: adds };

  return (
    <Overlay className='ps_container' loading={loading}>
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
  );
}