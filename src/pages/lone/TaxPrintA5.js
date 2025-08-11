import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import '../../css/bill.css';
import { getService } from '../../services';
import { Error, Overlay } from '../../components/all';
import { Header, Footer, Info, Items, ItemsHeader, Total, Pay } from '../../components/lone/tax';


export function TaxPrintA5() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
  const [info, setInfo] = useState(null);
  const [account, setAccount] = useState([]);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    setError(null);
    const invoiceNo = searchParams?.get('invoiceNo');
    const api = 'Sales/GetSalesBill?data=' + encodeURIComponent(invoiceNo);
    const response = await dispatch(getService(api, 'GET'));
    
    if (response?.error) {
      setError(response?.error);
    } else {
      const header = response?.data?.retdata?.sales?.[0];
      if (header) {
        header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
      }
      setHeader(header);
      setDetail(response?.data?.retdata?.salesitem);
      setInfo(response?.data?.retdata?.bill);
      setAccount(response?.data?.retdata?.invdtl);  
    }
    setLoading(false);
  };


  const onPressExport = async () => {
    try {
      const container = document.getElementById('list_scroll');
  
      const originalStyle = {
        height: container.style.height,
        overflow: container.style.overflow,
        maxHeight: container.style.maxHeight,
        flexWrap: container.style.flexWrap,
      };
  
      container.style.height = container.scrollHeight + 'px';
      container.style.overflow = 'visible';
      container.style.maxHeight = 'none';
      container.style.flexWrap = 'wrap';
  
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidthMM = 297;
      const pageHeightMM = 210;
      const marginMM = 2;
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
  
      const pxPerMM = canvas.width / pageWidthMM;
      const imgHeightMM = canvas.height / pxPerMM;
      let heightLeft = imgHeightMM;
      let position = marginMM;
  
      pdf.addImage(imgData, 'PNG', marginMM, position, pageWidthMM - marginMM * 2, imgHeightMM);
      heightLeft -= (pageHeightMM - marginMM * 2);
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeightMM + marginMM;
        pdf.addImage(imgData, 'PNG', marginMM, position, pageWidthMM - marginMM * 2, imgHeightMM);
        heightLeft -= (pageHeightMM - marginMM * 2);
      }
      pdf.save('Зарлагын_баримт_A5.pdf');
  
      container.style.height = originalStyle.height;
      container.style.overflow = originalStyle.overflow;
      container.style.maxHeight = originalStyle.maxHeight;
      container.style.flexWrap = originalStyle.flexWrap;
  
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Overlay loading={loading}>
      {error && <Error error={error}/>}
      <div id="list_scroll" className="invoice_pdf_back1">
        <div className="invoice_page">
          <Header header={header} isA4={true} />
          <Info header={header} isA4={true} />
          <ItemsHeader />
          <Items detail={detail} />
          <Total header={header} />
          <Pay header={header} />
          <Footer info={info} accounts={account} />
        </div>
        <div style={{ width: "1px", background: "var(--text2-color)"}}/>
        <div className="invoice_page">
          <Header header={header} isA4={true} />
          <Info header={header} isA4={true} />
          <ItemsHeader />
          <Items detail={detail} />
          <Total header={header} />
          <Pay header={header} />
          <Footer info={info} accounts={account}/>
        </div>
      </div>
      <button className="inv_pdf_btn" onClick={onPressExport}>
        {t('order.pdf')}
      </button>
    </Overlay>
  );
}
