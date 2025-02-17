import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import '../../css/bill.css';
import { getService } from '../../services';
import { Overlay } from '../../components/all';
import { Footer, Header, Info, Items, ItemsHeader, Total } from '../../components/lone/invoice';

export function InvoicePrint(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
  const [info, setInfo] = useState(null);
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
    let invoiceNo = searchParams?.get('invoiceNo');
    let api = 'Sales/GetSalesBill?data=' + encodeURIComponent(invoiceNo);
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setError(response?.error);
    else {
      let header = response?.data?.retdata?.sales && response?.data?.retdata?.sales[0];
      if(header) header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
      setHeader(header);
      setDetail(response?.data?.retdata?.salesitem);
      setInfo(response?.data?.retdata?.bill)
    }
    setLoading(false);
  }

  const onPressExport = () => {
    html2canvas(document.getElementById('invoice_back', { scale: 2 })).then(function(canvas) {
      const imgWidth = 297, pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      heightLeft -= pageHeight;
      const pdf = new jsPDF('l', 'mm', 'a4');
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      pdf.save('Нэхэмжлэх' + '.pdf');
    });
  }


  return (
    <Overlay loading={loading}>
      <div id='invoice_back' style={{ width: "297mm", height: "210mm", background: "white",  display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "49%", height: "100%", padding: "20px" }}>
          <Header/>
          <Info info={info} header={header}/>
          <ItemsHeader/>
          <Items detail={detail}/>
          <Total header={header}/>
          <Footer/>
        </div>
        <div
        style={{
          top: 0,
          left: "50%",
          width: "1px",
          height: "100%",
          background: "black"
        }}
      />
        <div style={{ width: "49%", height: "100%", padding: "20px" }}>
          <Header error={error}/>
          <Info info={info} header={header}/>
          <ItemsHeader/>
          <Items detail={detail}/>
          <Total header={header}/>    
          <Footer/>    
        </div>
      </div>
      <button className='inv_pdf_btn' onClick={onPressExport}>{t('order.pdf')}</button>
    </Overlay>
  )
}