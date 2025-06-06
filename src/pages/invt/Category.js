import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import { deleteMultiRequest, getList } from '../../services';
import { Empty, Error1, Overlay } from '../../components/all';
import { Add, List } from '../../components/invt/category';

export function Category(){
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState({});
  const [useConfig, setUseConfig] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.sort((a, b) => a.viewPriority - b.viewPriority));
    await getConfig();
    setLoading(false);
    setShow(false);
    setChecked(false);
    setSelected({});
  }

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setUseConfig(response?.data?.useKitchenPrinter === 'Y');
  }

  const onDelete = async toDelete => {
    setError(null);
    setLoading(true);
    const response = await dispatch(deleteMultiRequest(user, token, 'Inventory/DcCategory', toDelete));
    if(response?.error) {
      setError(response?.error);
      setLoading(false);
    }
    else getData();
  }

  const onClickAdd = item => {
    setVisible(true);
    setItem(item);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }

  const addProps = { visible, closeModal, selected: item, useConfig };
  const emptyProps = { icon: 'MdOutlineCategory', type: 'category', onClickAdd };
  const listProps = { data, onClickAdd, onDelete, setLoading, setError, show, setShow, checked, setChecked, selected, setSelected, setData };

  return (
    <div className='s_container_i'>
      <Add {...addProps} />
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
      </Overlay>
    </div>
  );
}