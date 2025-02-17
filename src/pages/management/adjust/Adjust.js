import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../../../css/order.css';
import '../../../css/invt.css';
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Filter, List, Subscription } from '../../../components/management/adjust/list';
import { Help } from '../../../components/invt/inventory/list';

export function Adjust(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    else {
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      onSearch(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async query => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Txn/GetAdjust' + (query ?? '')));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    else if(response?.error) setError(response?.error);
    else setData(response?.data?.adjfinal);
    setLoading(false);
  }

  const onDone = async () => {
    setVisible(false);
  }

  const onClickAdd = () => navigate('/management/adjust/adjust_add');

  const headerProps = { onClickAdd, setError, onSearch };
  const listProps = { data, onClickAdd };
  const subProps = { visible, setVisible, onDone };
  const videoData = [{id: "ZGz0whjGSJY"}]

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />} 
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='invt_list1'>
            <Filter {...headerProps} size={size} />
            {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  );
}