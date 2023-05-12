import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import '../../css/bill.css';
import { getService } from '../../services';
import { DynamicBSIcon, Error1, Overlay } from '../../components/all';
import { Footer, Header, Info, Items, Sign } from '../../components/lone/order';

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
      setHeader(response?.data?.retdata?.order && response?.data?.retdata?.order[0]);
      setDetail(response?.data?.retdata?.orderitem);
    }
    setLoading(false);
  }

  const onPressExport = () => {
    html2canvas(document.getElementById('order_bo_pdf')).then(function(canvas) {
      const imgWidth = 208, pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      heightLeft -= pageHeight;
      const pdf = new jsPDF('p', 'mm');
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      pdf.save('order_' + header?.orderNo + '.pdf');
    });
  }

  return (
    <>
    <Overlay loading={loading} className='bo_cont'>
      <div className='bo_back' id='order_bo_pdf'>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info header={header} />
            <Header />
            <Items detail={detail} />
            <Footer header={header} />
            <Sign />
          </div>
        }
      </div>
    </Overlay>
    <button className='bo_pdf_btn' onClick={onPressExport}>PDF</button>
    </>
  )
}