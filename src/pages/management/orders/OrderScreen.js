import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Menu, Header } from '../../../components/management/order/screen';

export function OrderScreen(){
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let orderNo = searchParams?.get('orderNo');
    if(orderNo){
      setError(null);
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get?OrderNo=' + orderNo));
      if(response?.error) setError(response?.error);
      else {
        let order = response?.data && response?.data[0];
        if(order){
          let total = 0, totalQty = 0, transitQty = 0;
          order?.poOrderItems?.forEach(poItem => {
            total += poItem.totalCost ?? 0;
            totalQty += poItem.orderQty ?? 0;
            transitQty += poItem.transitQty ?? 0;
          });
          order?.poOrderAddCosts?.forEach(addItem => total += addItem.addCostAmount ?? 0);
          order.poOrder.total = total;
          order.poOrder.totalQty = totalQty;
          order.poOrder.transitQty = transitQty;
          order.poOrder.percent = parseFloat((transitQty * 100 / totalQty)?.toFixed(2));
          setOrder(order?.poOrder);
        }
      }
      setLoading(false);
    }
  }

  const menuProps = { order };
  const emptyProps = { text: '', icon: 'MdOutlineArticle' };

  return (
    <Overlay className='ps_container' loading={loading}>
      {error && <Error1 error={error} />}
      <SizeMe>{({ size }) => 
        <div className='ps_back'>
          <Menu {...menuProps} size={size} />
          {!order ? <Empty1 {...emptyProps} /> :
          <div>
            <Header {...menuProps} size={size} />
          </div>}
        </div>
      }</SizeMe>
    </Overlay>
  );
}