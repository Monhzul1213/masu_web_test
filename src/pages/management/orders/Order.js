import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';

import '../../../css/order.css';
import { sendRequest } from '../../../services';
import { Overlay, Error1, Empty, Empty1 } from '../../../components/all';
import { Header, List } from '../../../components/management/order/list';
import { Subscription } from '../../../components/management/adjust/list';

export function Order(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [visible, setVisible] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get' + (query ?? '')));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        let total = 0;
        item?.poOrderItems?.forEach(poItem => {
          total += poItem.totalCost ?? 0;
        });
        item?.poOrderAddCosts?.forEach(addItem => total += addItem.addCostAmount ?? 0);
        item.poOrder.total = total;
        item.poOrder.percent = parseFloat(((item.poOrder.receivedTotalQty ?? 0) * 100 / (item.poOrder.totalQty ?? 0))?.toFixed(2));
      });
      setData(response?.data);
    }
    setLoading(false);
    setFiltering(query ? true : false);
  }

  const onClickAdd = () => {
    navigate({ pathname: '/management/order_list/order_vendors', search: createSearchParams({ next: '/management/order_list/order_add' }).toString() });
  }

  const onDone = async () => {
    setVisible(false);
  }
  
  const emptyProps = { icon: 'MdOutlineArticle', type: 'order', noDescr: true, onClickAdd };
  const headerProps = { onClickAdd, setError, onSearch: getData };
  const listProps = { data };
  const subProps = { visible, setVisible, onDone };

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              <Header {...headerProps} size={size} />
              {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
  );
}