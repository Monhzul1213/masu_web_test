import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter, Card, Header, List } from '../../components/report/receipt';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(1);
  const { user }  = useSelector(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(false);
    // setData(null);
    setData([{}]);
  }

  let filterProps = { onSearch: getData, size };
  let cardProps = { data, tab, setTab, size };
  let emptyProps = { id: 'rp_empty', icon: 'MdOutlineReceiptLong' };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        <Card {...cardProps} />
        <div className='rp_list'>
          <Header {...filterProps} />
          {data?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Receipt = withSizeHOC(Screen);