import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../../../src1/css/loyalty.css';
import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Filter, List } from '../../components/loyalty/coupon/list';
import { Subscription } from '../../../components/management/adjust/list/Subscription';

export function Coupon(){
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
    let api = 'Site/GetCoupon' + query ?? '';
    const response = await dispatch(getList(user, token, api));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    else if(response?.error) setError(response?.error);
    else {
      response?.data?.coupon?.forEach(item=> {
        item.date = moment(item?.beginDate)?.format('yyyy.MM.DD') + '-' + moment(item?.endDate)?.format('yyyy.MM.DD')
      })
      setData(response?.data?.coupon);
    }
    setLoading(false);
  }

  const onClickAdd = () => navigate('coupon_add');

  const onDone = async () => {
    setVisible(false);
  }

  const headerProps = { onClickAdd, setError, onSearch };
  const listProps = { data, onClickAdd };
  const subProps = { visible, setVisible, onDone };

  return (
    <div className='s_container_i'>
      {visible && <Subscription {...subProps} />}
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