import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SizeMe } from 'react-sizeme';
import { useNavigate } from 'react-router-dom';

import { Overlay, Error1  } from '../../components/all/all_m';
import { Add, Header, List } from '../../components/customer/customertype';
import { getList  } from '../../../services';
import '../../css/customer.css'
import { Subscription } from '../../../components/management/adjust/list/Subscription';
import { Empty1 } from '../../../components/all';
import { Help } from '../../../components/invt/inventory/list';

export function CustomerType(props){
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [typeName, setTypeName] = useState({ value: '' });
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query) => {
    // setFilter(query);
    setError(null);
    setLoading(true);
    let api = 'Site/GetCustomerType' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible1(true);
    }
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.msCustomerType)
    }
    setLoading(false);
    setChecked(false)
  }

  // const onClickDelete = () => setOpen(true);


  const onClickAdd = row => {
    setVisible(true);
    setTypeName({value: row?.typeName})
    setSelected(row);
  }

  const closeModal = toGet => {
    setVisible(false);
    getData();
  }

  const onDone = async () => {
    setVisible1(false);
  }

//   const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true, isMd : true};
  const listProps = { data, setData , setShow, checked, setChecked, show, setError, onSearch: getData, onClickAdd};
  const subProps = { visible: visible1, setVisible: setVisible1, onDone };
  const addProps = { visible, setVisible, closeModal, typeName, setTypeName, selected, onSearch: getData };
  const headerProps = { onSearch: getData, show };
  const videoData = [{id: "n07kE8xTJY4"}];

  return (
    <div className='s_container_z'>
      {visible1 && <Subscription {...subProps} />}
      {visible && <Add {...addProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='co_btn'>
            <Header {...headerProps} size={size} />
            {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  );
}