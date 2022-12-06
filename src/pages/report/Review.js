import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import { Error1, Overlay } from '../../components/all';
import { Filter } from '../../components/report/receipt';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webViewSalesReport !== 'Y') navigate({ pathname: '/' });
    else {
      // let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      // getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    console.log(query);
  }
  
  let filterProps = { onSearch: getData, size, setError };

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Filter {...filterProps} />
        {/* <Card {...cardProps} />
        <div className='rp_list'>
          <Header {...filterProps} />
          {filteredData?.length ? <List {...cardProps} /> : <Empty1 {...emptyProps} />}
        </div> */}
      </Overlay>
    </div>
  )
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);