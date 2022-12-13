import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../../css/order.css';
import '../../../css/invt.css';
import { sendRequest } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import { Menu } from '../../../components/management/order/screen';

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
        console.log(order, order?.poOrder?.status);
        if(order){
          setOrder(order?.poOrder);
        }
      }
      setLoading(false);
    }
  }

  const menuProps = { order };

  return (
    <Overlay className='ps_container' loading={loading}>
      {error && <Error1 error={error} />}
      <SizeMe>{({ size }) => 
        <div className='ps_back'>
          <Menu {...menuProps} size={size} />
        </div>
      }</SizeMe>
    </Overlay>
  );
}