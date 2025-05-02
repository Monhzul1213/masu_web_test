import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import '../../../css/bill.css';
import { getService } from '../../../services';
import { DynamicBSIcon, Error1, Overlay } from '../../../components/all';
import { Info, Header, Items, Total, QR } from './billComp';

export function Bill(props){
  const {header, footer, site, isPrint, image64 } = props
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [header, setHeader] = useState(null);
  // const [detail, setDetail] = useState(null);
  // const [payments, setPayments] = useState(null);
  // const [bill, setBill] = useState(null);
  // const [searchParams] = useSearchParams();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   getData();
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const getData = async () => {
  //   setLoading(true);
  //   setError(null);
  //   let billno = searchParams?.get('billno');
  //   let api = 'Sales/GetSalesBill?data=' + encodeURIComponent(billno);
  //   let response = await dispatch(getService(api, 'GET'));
  //   if(response?.error) setError(response?.error);
  //   else {
  //     let header = response?.data?.retdata?.sales && response?.data?.retdata?.sales[0];
  //     if(header) header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
  //     if(header) header.paidAmount = (header.totalCashAmount ?? 0) + (header.totalNonCashAmount ?? 0);
  //     // setHeader(header);
  //     setDetail(response?.data?.retdata?.salesitem);
  //     setPayments(response?.data?.retdata?.paymentitem?.filter(p => p?.detailType !== 0));
  //     setBill({...response?.data?.retdata?.bill, ...response?.data?.retdata?.data});
  //   }
  //   setLoading(false);
  // }
// console.log(header, footer, site);
  let data = [{
    price: '15000',
    amount: '30000',
    barCode: '12345678',
    qty: '2',
    invtId: '123',
    invtName: 'Pepsi том'
  },
  {
    price: '10000',
    amount: '100000',
    barCode: '000000123',
    qty: '10',
    invtId: '12',
    invtName: 'Fanta жижиг'
  }
  ];

  const infoProps = {header, site, image64};

  return (
    <Overlay loading={loading}>
      <div className='bl_back' id='bill_back1' style={{backgroundColor: '#f2f2f2'}}>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info {...infoProps}/>
            <Header />
            <Items detail ={data} showBarCode ={isPrint}/>
            <Total  />
            <QR/>
            <p className='bl_footer' style={{fontSize: 12, marginTop: '5px', whiteSpace: 'pre-line'}}>{footer?.value?.replace(/↵/g, '\n')}</p>
          </div>
        }
      </div>
    </Overlay>
  )
}