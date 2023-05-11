import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import '../../css/bill.css';
import { getService } from '../../services';
import { DynamicBSIcon, Error1, Overlay } from '../../components/all';
// import { Header, Info, Items, QR, Total } from '../../components/lone/bill';

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
    // setLoading(true);
    // setError(null);
    // let billno = searchParams?.get('billno');
    // let api = 'Sales/GetSalesBill?data=' + encodeURIComponent(billno);
    // let response = await dispatch(getService(api, 'GET'));
    // if(response?.error) setError(response?.error);
    // else {
    //   let header = response?.data?.retdata?.sales && response?.data?.retdata?.sales[0];
    //   if(header) header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
    //   if(header) header.paidAmount = (header.totalCashAmount ?? 0) + (header.totalNonCashAmount ?? 0);
    //   setHeader(header);
    //   setDetail(response?.data?.retdata?.salesitem);
    // }
    // setLoading(false);
  }

  return (
    <Overlay loading={loading}>
      <div className='bl_back'>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            {/* <Info header={header} />
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