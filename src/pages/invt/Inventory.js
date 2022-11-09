import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty, Empty1, Overlay } from '../../components/all';
import { Header, List } from '../../components/invt/inventory/list';

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
    // setData([
    //   { name: 'Actimel', category: 'Milk', price: 3200, cost: 2800, margin: +((3200 - 2800) / 3200 * 100).toFixed(2) + '%', variants: [] },
    //   { name: 'Tseneg', category: 'Supplement', price: 2400, cost: 2000, margin: +((2400 - 2000) / 2400 * 100).toFixed(2) + '%',
    //     variants: [
    //       { name: 'Pomegranate', price: 2400, cost: 2000, margin: +((2400 - 2000) / 2400 * 100).toFixed(2) + '%' },
    //       { name: 'Wisperia', price: 2400, cost: 2000, margin: +((2400 - 2000) / 2400 * 100).toFixed(2) + '%' },
    //     ]
    //   },
    // ]);
    // // setFiltering(true);
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

  const onClickDelete = () => {
    console.log('onClickDelete');
  }

  const onSearch = (site, category, name) => {
    console.log(site, category, name);
    //getData(site, category, name)
  }
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  // const listProps = { data, onClickAdd, onDelete, setLoading, setError, show, setShow, checked, setChecked, selected, setSelected };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch };
  const listProps = { data };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='i_list_cont' id='invt_list'>
            <Header {...headerProps} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} />}
          </div>
        }
      </Overlay>
    </div>
  )
}