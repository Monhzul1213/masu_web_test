import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';

import '../../css/bill.css';
import { getService } from '../../services';
import { Error, Overlay } from '../../components/all';
import { Footer, Header, Info, Items, ItemsHeader, Total } from '../../components/lone/invoice';

export function SalesPrint(){
  const { t } = useTranslation();
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
    const invoiceNo = searchParams?.get('invoiceNo');
    const api = 'Sales/GetSalesBillHold?data=' + encodeURIComponent(invoiceNo);
    const response = await dispatch(getService(api, 'GET'));
    if (response?.error) {
      setError(response?.error);
    } else {
      const header = response?.data?.retdata?.saleshold?.[0];
      if (header) {
        header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
      }
      setHeader(header);
      setDetail(response?.data?.retdata?.salesItemHold);
    }
    setLoading(false);
  };

  const onPressExport = () => {
    const element = document.getElementById('invoice_back');

    const opt = {
      margin: 0,
      filename: 'Нэхэмжлэх.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Overlay loading={loading}>
      {error && <Error error={error}/>}
      <div id="invoice_back" style={{ width: "297mm", background: "white", padding: "10mm", minHeight: '210mm' }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '190mm'
          }}>
            <div>
              <Header />
              <Info header={header} />
              <ItemsHeader />
              <Items detail={detail} />
              <Total header={header} />
            </div>
            <Footer />
          </div>
          <div
            style={{
              width: "1px",
              background: "black",
              margin: "0 1%",
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '190mm'
          }}>
            <div>
              <Header />
              <Info header={header} />
              <ItemsHeader />
              <Items detail={detail} />
              <Total header={header} />
            </div>
            <Footer />
          </div>
        </div>
      </div>

      <button className="inv_pdf_btn" onClick={onPressExport}>
        {t('order.pdf')}
      </button>
    </Overlay>
  );
}