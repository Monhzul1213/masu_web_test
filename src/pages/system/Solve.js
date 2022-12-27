import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Header, List } from '../../components/system/solve/list';

export function Solve(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
    getData(query);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Merchant/VatRequest/GetSolvedRequests' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.request);
    setLoading(false);
  }

  const onClickAdd = row => {
    navigate({ pathname: 'solve_edit', search: createSearchParams({ requestId: row?.reqeustId }).toString() });
  }
  
  const headerProps = { setError, onSearch: getData };
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };
  const listProps = { data, setData, onClickAdd };

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