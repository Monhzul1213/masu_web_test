import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import '../../css/bill.css';
import { getService } from '../../services';
import { DynamicBSIcon, Error1, Overlay } from '../../components/all';
import { Header, Info, Items, Total } from '../../components/lone/bill';

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
    else {
      let header = response?.data?.retdata?.sales;
      if(header) header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
      setData(response?.data?.retdata);
    }
    setLoading(false);
  }

  return (
    <Overlay loading={loading}>
      {error && <Error1 error={error} />}
      <div className='bl_back'>
        {!data ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info header={data?.sales} />
            <Header />
            <Items detail={data?.salesitem} />
            <Total header={data?.sales} />
          </div>
        }
      </div>
    </Overlay>
  )
}