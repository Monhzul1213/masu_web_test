import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../../src1/components/all/all_m';
import { List, Header } from '../../components';
import { Subscription } from '../../../components/management/adjust/list/Subscription';

export function EmployeeService(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const [checked, setChecked] = useState(false);
  const [dialogClose, setDialagClose] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    user?.msRole?.webAppointment  !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogClose]);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Employee/GetEmployeeService' + (query ?? '') ;
    const response = await dispatch(getList(user, token, api));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    else if(response?.error) setError(response?.error);
    else setData(response?.data?.allsitedata);
    setServiceData(response?.data?.employeeservice);
    setLoading(false);
    setShow(false);
  }

  const onDone = async () => {
    setVisible(false);
  }

  const listProps = {data, setError, onSearch: getData, sites, setSites, emps, setEmps, serviceData, checked, setChecked, setData, setShow, setDialagClose, dialogClose };
  const headerProps = { data, setError, onSearch: getData, sites, setSites, emps, setEmps, show };
  const subProps = { visible, setVisible, onDone};

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
            <div className='i_list_cont' id='invt_list'>
               <Header {...headerProps} size={size} />
              <List {...listProps} size={size} />
            </div>
          }</SizeMe>
      </Overlay>
    </div>
  )
}