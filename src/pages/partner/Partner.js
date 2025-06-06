import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import '../../css/invt.css';
import { getPartnerList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Header, List } from '../../components/partner';

export function Partner(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let query = '&BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') +
      '&EndDate=' + moment()?.format('yyyy.MM.DD');
    getData(query);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Merchant/getPartnerInfo?PartnerCode=' + (user?.partnerCode ?? '') + (query ?? '');
    const response = await dispatch(getPartnerList(user, token, api));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  const headerProps = { setError, onSearch: getData };
  const emptyProps = { icon: 'MdReceipt', type: 'time', noDescr: true };
  const listProps = { data, setData };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='solve_list'>
            <Header {...headerProps} size={size} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}