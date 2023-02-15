import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { Empty, Empty1, Error1, Overlay } from '../../components/all';
import { Header, List } from '../../components/emp/employee/list';

export function Employee(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [filter, setFilter] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    user?.msRole?.webManageEmployy !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Employee/GetEmployees' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFiltering(query ? true : false);
    setFilter(query);
  }

  const onClickAdd = row => {
    if(row) navigate({ pathname: 'emp_add', search: createSearchParams({ empCode: row?.empCode }).toString() });
    else navigate('emp_add');
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D', roleID: item?.roleId, password: '', poS_PIN: '', employeeSites: [] });
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Employee/Modify', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('employee.delete_success'));
      getData(filter);
    }
  }

  const onSubscribe = async selected => {
    setError(null);
    setLoading(true);
    let employeeSites = selected?.empsites?.map(item => {
      item.rowStatus = 'U';
      return item;
    });
    let data = [{...selected, employeeSites, rowStatus: 'U', status: 1}];
    let response = await dispatch(sendRequest(user, token, 'Employee/Modify', data));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else getData(filter);
  }

  const emptyProps = { icon: 'MdOutlinePersonOutline', type: 'employee', onClickAdd, noDescr: true };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch: getData };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked, onSubscribe };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
              <Header {...headerProps} size={size} />
              {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
            </div>
          }</SizeMe>
        }
      </Overlay>
    </div>
  )
}