import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Empty, Overlay, Error1 , Empty1} from '../../components/all/all_m';
import {  List , Header} from '../../components/suppliers';
import { getList, sendRequest } from '../../../services';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { SizeMe } from 'react-sizeme';
import { useNavigate } from 'react-router-dom';
import '../../css/supplier.css'
export function Suppliers(props){
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loaded] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering ] = useState(false);
  const [filter,  setFilter] =   useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  
  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) 
    : getData();
      return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D' });
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Merchant/vendor', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('supplier.delete_success'));
      getData(filter);
    }
  }


  const onClickAdd = () => navigate('supp_add');

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Merchant/vendor/getvendor/' +( query ?? '') ;
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFiltering(query ? true : false);
    setFilter(query);
  }
  
  const emptyProps = { icon: 'TbCar', type: 'supplier', noDescr: true, onClickAdd , isTb: true,  };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch: getData ,};
  const listProps = { data, onClickAdd, setData , loaded, setShow, checked, setChecked  };
  return (
    <div className='s_container_z'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
           <SizeMe>{({ size }) => 
           <div className='i_list_cont_z' id='invt_list_z'>
             <Header {...headerProps} size={size} />
             {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
           </div>
         }</SizeMe>
        }      

        </Overlay>
    </div>
  );
}