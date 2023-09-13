import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';

import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';

function Card(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/GetSubScriptionInfo'));
    if(response?.error) setError(response?.error);
    else {
      setHasData(response?.data?.empSubscriptions?.length || response?.data?.siteSubscriptions?.length);
      setData1(response?.data?.empSubscriptions);
      setData2(response?.data?.siteSubscriptions);
    }
    setLoading(false);
  }

  const width = size?.width >= 840 ? 840 : size?.width;
  const emptyProps = { icon: 'MdReceipt', text: 'invoices.empty' };
  
  return (
    <div className='store_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {hasData ?
          <div className='mo_container' style={{ width }}>
            2 lists
          </div>
        : <div style={{ width }}><Empty1 {...emptyProps} /></div>}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Invoices = withSizeHOC(Card);