import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../css/customer.css'
import { SizeMe } from 'react-sizeme';
import { Empty, Overlay, Error1 , Confirm, Empty1} from '../../components/all/all_m';
import { Add, List , Header} from '../../components/customer';
import { getList , sendRequest} from '../../../services';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export function Customer(props){
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [custId] = useState( -1);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [filter,  setFilter] =   useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [autoResetExpanded, setAutoResetExpanded] = useState(false);
  const [checked, setChecked] = useState(false);

  
  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    let headers = { custId};
    const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
    console.log(response?.data)
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.customers)
    }
    setLoaded(loaded + 1);
    setLoading(false);
    setShow(false)
    setChecked(false)
  }

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item.checked){
          item.rowStatus = 'D';
          toDelete.push(item);
        }
      });
      setLoading(true);
      setError(null);
      let response = await dispatch(sendRequest(user, token, 'Site/Customer', toDelete));
      setLoading(false);
      setShow(false);
      if(response?.error) setError(response?.error);
      else {
        message.success(t('customer.delete_success'))
        onSearch(filter)
      }
    }
  };

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }
  
  const onSearch = async( name , isEdit)=> {
    setFilter(name);
    setError(null);
    setLoading(true);
    setAutoResetExpanded(isEdit ? false : true);
    let headers = { custId};
    let response = name
      ? await dispatch(getList(user, token, 'Site/GetCustomer/' + name ))
      : await dispatch(getList(user, token, 'Site/GetCustomer',null,  headers));
    setData(response?.data);
    setLoading(false);
    setFiltering(true);
  }
  


  const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true, onClickAdd , isMd : true};
  const modalProps = { visible, closeModal, selected: item, onSearch, filter, data, };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch ,};
  const listProps = { data,  onClickAdd, setData , loaded, setShow, autoResetExpanded, checked, setChecked  };
  return (
    <div className='s_container_z'>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
      {open && <Confirm {...confirmProps} />}
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