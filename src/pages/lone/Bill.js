import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { getService } from '../../services';
import { Error1, Overlay } from '../../components/all';

export function Bill(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    setError(null);
    let billno = searchParams?.get('billno');
    let api = 'Sales/GetSalesBill?data=' + encodeURIComponent(billno);
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  return (
    <Overlay className='i_container' loading={!loading}>
      {error && <Error1 error={error} />}
    </Overlay>
  )
}