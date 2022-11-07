import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty, Overlay } from '../../components/all';
import { Header } from '../../components/invt/inventory/list';

export function Inventory(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // getData();
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

  const onClickDelete = () => {
    console.log('onClickDelete');
  }

  const onSearch = (site, category, name) => {
    console.log(site, category, name);
    //getData(site, category, name)
  }
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  // const listProps = { data, onClickAdd, onDelete, setLoading, setError, show, setShow, checked, setChecked, selected, setSelected };
  // const listProps = { setError };//onClickAdd, onClickDelete, 
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='i_list_cont'>
            <Header {...headerProps} />
          </div>
        }
      </Overlay>
    </div>
  )
}