import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import '../../css/bill.css';
import { getService } from '../../services';
import { DynamicBSIcon, Error1, Overlay } from '../../components/all';
import { Info } from '../../components/lone/order';

export function Order(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
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
    let orderno = searchParams?.get('orderno');
    let api = 'Txn/GetOrderBill?data=' + encodeURIComponent(orderno);
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setError(response?.error);
    else {
      setHeader(response?.data?.retdata?.order);
      setDetail(response?.data?.retdata?.orderitem);
    }
    setLoading(false);
  }

  return (
    <Overlay loading={loading}>
      <div className='bl_back' id='bo_back'>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info header={header} />
            {/*
            <Header />
            <Items detail={detail} />
            <Total header={header} />
            <QR header={header} /> */}
          </div>
        }
      </div>
    </Overlay>
  )
}