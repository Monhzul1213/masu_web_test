import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';

import '../../css/invt.css';
import { Empty, Empty1, Error1, Overlay } from '../../components/all';
import { Header, List, Add } from '../../components/emp/time';
import { getList } from '../../services';

export function Time(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filter, setFilter] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageEmployy !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setData([{}]);
    // setError(null);
    // setLoading(true);
    // let api = 'Employee/GetEmployees' + (query ?? '');
    // const response = await dispatch(getList(user, token, api));
    // if(response?.error) setError(response?.error);
    // else setData(response?.data);
    // setLoading(false);
    // setShow(false);
    // setChecked(false);
    // setFiltering(query ? true : false);
    // setFilter(query);
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row);
  }

  const onClickDelete = async () => {
    // let toDelete = [];
    // data?.forEach(item => {
    //   if(item.checked) toDelete.push({...item, rowStatus: 'D', roleID: item?.roleId, password: '', poS_PIN: '', employeeSites: [] });
    // });
    // setError(null);
    // setLoading(true);
    // let response = await dispatch(sendRequest(user, token, 'Employee/Modify', toDelete));
    // setLoading(false);
    // if(response?.error) setError(response?.error);
    // else {
    //   message.success(t('employee.delete_success'));
    //   getData(filter);
    // }
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData(filter);
  }

  const getSites = async () => {
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) return response?.error;
    else setSites(response?.data);
    return null;
  }

  const getEmps = async () => {
    const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
    if(response?.error) return response?.error;
    else setEmps(response?.data);
    return null;
  }

  const emptyProps = { icon: 'MdSchedule', type: 'time', onClickAdd, noDescr: true };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch: getData, sites, setSites, emps, setEmps, getSites, getEmps };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked };
  const modalProps = { visible, closeModal, selected: item };

  return (
    <div className='s_container_i'>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='i_list_cont' id='invt_list'>
            <Header {...headerProps} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} />}
          </div>
        }
      </Overlay>
    </div>
  );
}