import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../../../src1/css/loyalty.css';
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Filter, List } from '../../components/loyalty/coupon/list';
// import { Subscription } from '../../../components/management/adjust/list';

export function Coupon(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  // const [visible, setVisible] = useState(false);
  // const [sites, setSites] = useState([]);
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
    const response = await dispatch(getList(user, token, 'Site/GetCoupon' + query ?? ''));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.coupon?.filter( item => item?.status !== 0));
    setLoading(false);
  }

  const onClickAdd = () => navigate('coupon_add');

  // const onDone = async () => {
  //   setVisible(false);
  //   setSites([]);
  //   let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
  //   onSearch(query);
  // }

  const headerProps = { onClickAdd, setError, onSearch };
  const listProps = { data, onClickAdd };
  // const subProps = { visible, setVisible, sites, setSites, onDone };

  return (
    <div className='s_container_i'>
      {/* {visible && <Subscription {...subProps} />} */}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='invt_list'>
            <Filter {...headerProps} size={size} />
            {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}