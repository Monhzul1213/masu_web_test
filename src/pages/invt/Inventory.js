import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty, Overlay } from '../../components/all';
import { List } from '../../components/invt/inventory';

export function Inventory(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  const onClickAdd = () => {
    navigate('invt_add');
  }
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  // const listProps = { data, onClickAdd, onDelete, setLoading, setError, show, setShow, checked, setChecked, selected, setSelected };
  const listProps = { };

  return (
    <div className='s_container'>
      <Overlay loading={loading}>
        {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
      </Overlay>
    </div>
  )
}