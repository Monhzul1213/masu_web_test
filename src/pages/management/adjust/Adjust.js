import React, { useState } from 'react';
import { SizeMe } from 'react-sizeme';

import '../../../css/order.css';
import '../../../css/invt.css';
import { Error1, Overlay } from '../../../components/all';
import { Filter } from '../../../components/management/adjust/list';

export function Adjust(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSearch = async query => {
    console.log(query);
    // comment
    // setError(null);
    // setLoading(true);
    // const response = await dispatch(sendRequest(user, token, 'Txn/Order/Get' + (query ?? '')));
    // if(response?.error) setError(response?.error);
    // else {
    //   response?.data?.forEach(item => {
    //     let total = 0;
    //     item?.poOrderItems?.forEach(poItem => {
    //       total += poItem.totalCost ?? 0;
    //     });
    //     item?.poOrderAddCosts?.forEach(addItem => total += addItem.addCostAmount ?? 0);
    //     item.poOrder.total = total;
    //     item.poOrder.percent = parseFloat(((item.poOrder.receivedTotalQty ?? 0) * 100 / (item.poOrder.totalQty ?? 0))?.toFixed(2));
    //   });
    //   setData(response?.data);
    // }
    // setLoading(false);
    // setFiltering(query ? true : false);
  }

  const onClickAdd = () => {
    // comment
    // status
    // navigate({ pathname: '/management/order_list/order_vendors', search: createSearchParams({ next: '/management/order_list/order_add' }).toString() });
  }

  const headerProps = { onClickAdd, setError, onSearch };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='invt_list'>
            <Filter {...headerProps} size={size} />
            {/* {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />} */}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}

/**
comment
import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';

import { sendRequest } from '../../../services';
import { Overlay, Error1, Empty, Empty1 } from '../../../components/all';
import { Header, List } from '../../../components/management/order/list';

export function Order(){
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : onSearch();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

 
  
  const emptyProps = { icon: 'MdOutlineArticle', type: 'order', noDescr: true, onClickAdd };
  const listProps = { data };
  
  return (
    
  );
}
 */