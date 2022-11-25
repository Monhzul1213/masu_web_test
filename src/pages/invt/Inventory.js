import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../css/invt.css';
import { deleteMultiRequest, getList, sendRequest } from '../../services';
import { Confirm, Empty, Empty1, Error1, Overlay } from '../../components/all';
import { Header, List } from '../../components/invt/inventory/list';

export function Inventory(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const [autoResetExpanded, setAutoResetExpanded] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        let margin = +((item.msInventory.price - item.msInventory.cost) / (item.msInventory.price ? item.msInventory.price : 1) * 100).toFixed(2);
        item.msInventory.margin = (isNaN(margin) ? 0 : margin) + '%';
        item?.msInventoryVariants?.forEach(vart => {
          let margin = +((vart.price - vart.cost) / (vart.price ? vart.price : 1) * 100).toFixed(2);
          vart.margin = (isNaN(margin) ? 0 : margin) + '%';
        });
      });
      setData(response?.data);
    }
    setLoading(false);
    setShow(false);
    setChecked(false);
  }

  const getInventory = async () => {
    setError(null);
    setLoading(true);
    setAutoResetExpanded(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
    setInventory(response);
  }

  const onSearch = async (filter, isEdit) => {
    setFilter(filter);
    setError(null);
    setLoading(true);
    setAutoResetExpanded(isEdit ? false : true);
    let response = filter?.length
      ? await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      : await dispatch(getList(user, token, 'Inventory/GetInventory'));
    setInventory(response);
    setFiltering(true);
  }

  const onClickAdd = row => {
    if(row) navigate({ pathname: 'invt_add', search: createSearchParams({ invtId: row?.invtId }).toString() });
    else navigate('invt_add');
  }

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item.checked) toDelete.push({ invtID: item?.msInventory?.invtId });
      });
      setError(null);
      setLoading(true);
      let response = await dispatch(deleteMultiRequest(user, token, 'Inventory/DcInventory', toDelete));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        message.success(t('inventory.delete_success'));
        onSearch(filter);
      }
    }
  }

  const updateInventory = async (data, isEdit, isExpand) => {
    if(!isEdit) setLoading(true);
    setError(null);
    const response = await dispatch(sendRequest(user, token, 'Inventory/UInvCustom', data));
    setLoading(false);
    if(!response?.error){
      message.success(t('inventory.add_success'));
      onSearch(filter, isEdit || isExpand);
    } else if(response?.error && !isEdit) setError(response?.error);
    return response;
  }

  const onClickDelete = () => setOpen(true);
 
  const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch, cats: categories };
  const listProps = { data, setData, categories, onClickAdd, setShow, checked, setChecked, updateInventory, autoResetExpanded };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container_i'>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              <Header {...headerProps} size={size} />
              {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} />}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
  )
}