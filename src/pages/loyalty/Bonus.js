import React, { useState } from 'react';
import { SizeMe } from 'react-sizeme';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/loyalty/bonus/list';

export function Bonus(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSearch = async query => {
    // comment
    // setError(null);
    // setLoading(true);
    // let api = 'Site/GetCoupon' + query ?? '';
    // const response = await dispatch(getList(user, token, api));
    // if(response?.error) setError(response?.error);
    // else {
    //   response?.data?.coupon?.forEach(item=> {
    //     item.date = moment(item?.beginDate)?.format('yyyy.MM.DD') + '-' + moment(item?.endDate)?.format('yyyy.MM.DD')
    //   })
    //   setData(response?.data?.coupon);
    // }
    // setLoading(false);
  }

  const onClickAdd = () => {};//comment navigate('coupon_add');

  const headerProps = { onClickAdd, setError, onSearch, setError };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='invt_list'>
            {/* comment */}
            <Filter {...headerProps} size={size} />
            {/* {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : <List {...listProps} size={size} />} */}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}

/**
comment
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { getList } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Filter, List } from '../../components/loyalty/coupon/list';

export function Coupon(){
  const [data, setData] = useState([]);
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

  


  const listProps = { data, onClickAdd };

  return (
    
  );
}
 */