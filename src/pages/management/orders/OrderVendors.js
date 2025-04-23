import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import '../../../css/invt.css';
import '../../../css/order.css';
import { getList } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import { Empty } from '../../../src1/components/all/all_m';
import { Vendors } from '../../../components/management/order/add';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webIsReceipt !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else setData(response?.data);
  }

  const onClickAdd = () => navigate('/management/suppliers');

  const emptyProps = { icon: 'TbCar', type: 'supplier', noDescr: true, onClickAdd, isTb: true };
  const listProps = { data, size };

  return (
    <Overlay className='po_vend_container' loading={loading}>
      {error && <Error1 error={error} />}
      {!data?.length ? <Empty {...emptyProps} /> : <Vendors {...listProps} />}
    </Overlay>
  );
}

const withSizeHOC = withSize();
export const OrderVendors = withSizeHOC(Screen);