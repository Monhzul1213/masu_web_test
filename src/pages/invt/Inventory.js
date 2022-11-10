import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { Empty, Empty1, Overlay } from '../../components/all';
import { Header, List } from '../../components/invt/inventory/list';

export function Inventory(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    let response = await getCategories();
    if(response) await getInventory();
  }

  const getCategories = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
      setCategories(data);
      return true;
    }
  }

  const setInventory = response => {
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        let margin = +((item.msInventory.price - item.msInventory.cost) / item.msInventory.price * 100).toFixed(2);
        item.msInventory.margin = (isNaN(margin) ? 0 : margin) + '%';
        item?.msInventoryVariants?.forEach(vart => {
          let margin = +((vart.price - vart.cost) / vart.price * 100).toFixed(2);
          vart.margin = (isNaN(margin) ? 0 : margin) + '%';
        });
      });
      setData(response?.data);
    }
    setLoading(false);
  }

  const getInventory = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
    setInventory(response);
  }

  const onSearch = async (site, category, name) => {
    let data = [];
    if(site !== -1) data.push({ fieldName: 'SiteID', value: site });
    if(category !== -2) data.push({ fieldName: 'CategoryID', value: category });
    data.push({ fieldName: 'Name', value: name });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    setInventory(response);
    setFiltering(true);
  }

  const onClickAdd = row => {
    if(row) navigate({ pathname: 'invt_add', search: createSearchParams({ invtId: row?.invtId }).toString() });
    else navigate('invt_add');
  }

  const onClickDelete = () => {
    console.log('onClickDelete');
  } 
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch, cats: categories };
  const listProps = { data, categories, onClickAdd };

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