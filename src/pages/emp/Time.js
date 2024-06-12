import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Header, List, Add } from '../../components/emp/time';

export function Time(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filter, setFilter] = useState('');
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else {
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Employee/TimeCard/GetTimeCard' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        item.begin = item.beginDate + ' ' + item?.beginTime;
        item.end = item.endDate + ' ' + item?.endTime;
      });
      setData(response?.data);
    }
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFilter(query);
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row);
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D' });
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Employee/TimeCard', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('time.delete_success'));
      getData(filter);
    }
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData(filter);
  }

  const emptyProps = { icon: 'MdSchedule', type: 'time', onClickAdd, noDescr: true };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch: getData, sites, setSites, emps, setEmps };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked };
  const modalProps = { visible, closeModal, selected: item, sites, emps };

  return (
    <div className='s_container_i'>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='invt_list'>
            <Header {...headerProps} size={size} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}