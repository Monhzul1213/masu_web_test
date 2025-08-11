import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import '../../css/bill.css';
import { Error, Overlay } from '../../components/all';
import { Footer, Header, Info, Items, ItemsHeader, Total, InfoBank } from '../../components/lone/invoice';
import { Modal } from 'antd';


export function InvoicePrint(props){
  const {loading, error, header, account, detail, info, day, visible2} = props;
  const { t } = useTranslation();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [header, setHeader] = useState(null);
  // const [day, setDay] = useState(null);
  // const [detail, setDetail] = useState(null);
  // const [account, setAccount] = useState(null);
  // const [info, setInfo] = useState(null);
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
  //   const invoiceNo = searchParams?.get('invoiceNo');
  //   const api = 'Sales/GetSalesBill?data=' + encodeURIComponent(invoiceNo);
  //   const response = await dispatch(getService(api, 'GET'));
  //   if (response?.error) {
  //     setError(response?.error);
  //   } else {
  //     const header = response?.data?.retdata?.sales?.[0];
  //     if (header) {
  //       header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
  //     }
  //     setHeader(header);
  //     setDetail(response?.data?.retdata?.salesitem);
  //     setInfo(response?.data?.retdata?.bill);
  //     setAccount(response?.data?.retdata?.invdtl);
  //     setDay(response?.data?.retdata?.inv?.[0])
  //   }
  //   setLoading(false);
  // };

  const onPressExport = async () => {
    try {
      const container = document.getElementById('table_scroll');
      if (!container) {
        console.error('Container элемент олдсонгүй');
        return;
      }
  
      const pages = container.querySelectorAll('.invoice_page');
      if (pages.length === 0) {
        console.error('No invoice_page элемент олдсонгүй');
        return;
      }
  
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
      const pageWidthMM = 297;
      const pageHeightMM = 210;
      const marginMM = 5;
  
      const a5WidthMM = pageWidthMM / 2; // 148.5
      const a5HeightMM = pageHeightMM;   // 210
  
      for (let i = 0; i < pages.length; i += 2) {
        if (i > 0) pdf.addPage();
  
        // Хоёр A5 хуудсыг canvas болгон авахад scroll-г түр хаах хэрэгтэй
        for (const pageIndex of [i, i + 1]) {
          if (pages[pageIndex]) {
            pages[pageIndex].style.height = pages[pageIndex].scrollHeight + 'px';
            pages[pageIndex].style.overflow = 'visible';
          }
        }
  
        // Footer-г зөвхөн хамгийн сүүлийн хоёр хуудасны footer-д хэвлэх болгох
        pages.forEach((page, idx) => {
          const footer = page.querySelector('.footer');
          if (footer) {
            // Зүүн ба баруун талын хамгийн сүүлийн хоёр хуудсан дээр л харуулах
            if (idx === pages.length - 1 || idx === pages.length - 2) {
              footer.style.display = 'block';
            } else {
              footer.style.display = 'none';
            }
          }
        });
  
        // Зүүн талын A5 canvas
        const leftPage = pages[i];
        const leftCanvas = leftPage ? await html2canvas(leftPage, { scale: 2, useCORS: true }) : null;
        const leftImg = leftCanvas ? leftCanvas.toDataURL('image/png') : null;
  
        // Баруун талын A5 canvas
        const rightPage = pages[i + 1];
        const rightCanvas = rightPage ? await html2canvas(rightPage, { scale: 2, useCORS: true }) : null;
        const rightImg = rightCanvas ? rightCanvas.toDataURL('image/png') : null;
  
        if (i > 0) pdf.addPage();
  
        // Зүүн талын зураг pdf дээр байрлуулах
        if (leftImg) {
          pdf.addImage(leftImg, 'PNG', marginMM, marginMM, a5WidthMM - marginMM * 2, a5HeightMM - marginMM * 2);
        }
        // Баруун талын зураг pdf дээр байрлуулах
        if (rightImg) {
          pdf.addImage(rightImg, 'PNG', a5WidthMM + marginMM, marginMM, a5WidthMM - marginMM * 2, a5HeightMM - marginMM * 2);
        }
  
        // Canvas дууссаны дараа scroll, height-г буцаан тохируулах
        for (const pageIndex of [i, i + 1]) {
          if (pages[pageIndex]) {
            pages[pageIndex].style.height = '';
            pages[pageIndex].style.overflow = '';
          }
        }
      }
  
      pdf.save('Нэхэмжлэх_2xA5_footer_scroll.pdf');
    } catch (error) {
      console.error('PDF үүсгэхэд алдаа:', error);
    }
  };
  

  return (
    <Modal title={null} footer={null} closable={false} open={visible2} centered={true} width={'297mm'}>
      <Overlay loading={loading}>
        {error && <Error error={error}/>}
        {/* <div id="invoice_back" style={{ display: "flex", justifyContent: "space-between" , width: "297mm", background: "white", padding: "5mm 6mm", minHeight: '210mm' }}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190mm'}}>
            <div>
              <Header header={header}/>
              <InfoBank header={header} account={account} day={day}/>
              <div className='iline'/>
              <Info header={header} />
              <ItemsHeader />
              <Items detail={detail} />
              <Total header={header} />
            </div>
            <Footer info={info}/>
          </div>
          <div
            style={{
              width: "1px",
              background: "var(--text2-color)",
              // margin: "0 1%",
            }}
          />
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190mm'}}>
            <div>
              <Header header={header}/> 
              <InfoBank header={header} account={account} day={day}/>
              <div className='iline'/>
              <Info header={header} />
              <ItemsHeader />
              <Items detail={detail} />
              <Total header={header} />
            </div>
            <Footer info={info}/>
          </div>
          </div> */}
        <div id="table_scroll" className="invoice_pdf_back1" style={{gap: 15}}>
          <div className='invoice_page' style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <Header header={header}/> 
                <InfoBank header={header} account={account} day={day}/>
                <div className='iline'/>
                <Info header={header} />
                <ItemsHeader />
                <Items detail={detail} />
                <Total header={header} />
              </div>
              <div className="footer">
              <Footer info={info}/>
              </div>
          </div>
          <div style={{ width: "1px", background: "var(--text2-color)"}}/>
          <div className='invoice_page' style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
              <Header header={header}/> 
              <InfoBank header={header} account={account} day={day}/>
              <div className='iline'/>
              <Info header={header} />
              <ItemsHeader />
              <Items detail={detail} />
              <Total header={header} />
              </div>
              <div className="footer">
                <Footer info={info}/>
              </div>
          </div>
        </div>
        
        <button className="inv_pdf_btn" onClick={onPressExport} style={{right: '40%'}}>
          {t('order.pdf')}
        </button>
      </Overlay>
    </Modal>
  );
}