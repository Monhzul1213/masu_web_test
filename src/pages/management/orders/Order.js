import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';

import '../../../css/order.css';
import { sendRequest } from '../../../services';
import { Overlay, Error1, Empty } from '../../../components/all';
import { Header } from '../../../components/management/order/list';

export function Order(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
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
    //?OrderNo=1&SiteID=1&VendID=1&Status=1
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    console.log(response?.data);
    setLoading(false);
    setFiltering(query ? true : false);
  }

  const onClickAdd = () => {
    navigate({ pathname: '/management/order_list/order_vendors', search: createSearchParams({ next: '/management/order_list/order_add' }).toString() });
  }
  
  const emptyProps = { icon: 'MdOutlineArticle', type: 'order', noDescr: true, onClickAdd };
  const headerProps = { onClickAdd, setError, onSearch: getData };
  
  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              <Header {...headerProps} size={size} />
              {/* {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />} */}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
  );
}