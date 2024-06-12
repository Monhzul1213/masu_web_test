import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { DynamicBSIcon, Error1, Overlay } from '../../../all';
import { Header, Footer, Items, Info, Sign } from './inv/';
import { getService } from '../../../../services';
import { config } from '../../../../helpers';
 
export function InvoiceSend(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
  const [sum, setSum] = useState(0);
  const [url, setUrl] = useState(null);
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
    let invoiceno = searchParams?.get('invoiceno');
    let api = 'Txn/GetInvoiceData?data=' + encodeURIComponent(invoiceno);
    let response = await dispatch(getService(api, 'GET'));
    let url1 = config?.domain + '/statement?invoiceno=' + encodeURIComponent(invoiceno);
    if(response?.error) setError(response?.error);
    else {
      setHeader(response?.data?.retdata && response?.data?.retdata[0]);
      setDetail(response?.data?.retdata);
      setUrl(url1)
      let sum1 = 0;
      response?.data?.retdata.forEach(item => {
         sum1 += item?.amount
      })
      setSum(sum1)
    }
    setLoading(false);
  }

  const onPressPrint = () => {
    html2canvas(document.getElementById('invoice_pdf')).then(function(canvas) {
      const imgWidth = 208, pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      heightLeft -= pageHeight;
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      pdf.save('invoice_' + header?.invoiceNo + '.pdf');
    });
  }


  return (
    <>
    <Overlay loading={loading} className='in_cont'>
      <div className='in_back' id='invoice_pdf'>
        {error && <Error1 error={error} />}
        {!'header' ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
            <Info header={header} url={url} />
            <Header />
            <Items  detail={detail}/>
            <Footer sum={sum}/>
            <Sign header={header}/>
          </div>
        }
      </div>
    </Overlay>
    <div className='invt_btn_row' id='in_ac_btns'>
      <button className='in_pdf_btn' onClick={onPressPrint}>{t('system.pdf')}</button>
    </div>
    </>
  );
}