import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Modal } from 'antd';
import { BsFillPrinterFill } from 'react-icons/bs';
import { FaFilePdf } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

import '../../css/bill.css';
import { Error, Overlay } from '../../components/all';
import { Header, Footer, Info, Items, ItemsHeader, Total, Pay } from '../../components/lone/tax';


export function TaxPrintA5(props) {
  const {loading, error, header, account, detail, info, visible1, setVisible1} = props;

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

  const onPressPrint = async () => {
    const container = document.getElementById('table_scroll');
    if (!container) return;
  
    const originalStyle = {
      height: container.style.height,
      maxHeight: container.style.maxHeight,
      overflow: container.style.overflow,
    };
  
    try {
      container.style.height = container.scrollHeight + 'px';
      container.style.maxHeight = 'none';
      container.style.overflow = 'visible';
  
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const options = {
        margin: 0,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };
  
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
      const blob = await html2pdf()
        .set(options)
        .from(container)
        .outputPdf('blob');
  
      const blobUrl = URL.createObjectURL(blob);
  
      if (isSafari) {
        printUsingIframe(blobUrl);
      } else {
        const newWin = window.open('', '_blank');
        if (newWin) {
          newWin.document.write(`
            <html>
              <head><title>Print PDF</title></head>
              <body style="margin:0">
                <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.focus();
                      window.print();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          newWin.document.close();
        } else {
          printUsingIframe(blobUrl);
        }
      }
  
    } catch (error) {
      console.error('PDF print error:', error);
    } finally {
      container.style.height = originalStyle.height;
      container.style.maxHeight = originalStyle.maxHeight;
      container.style.overflow = originalStyle.overflow;
    }
  };
  
  const printUsingIframe = (blobUrl) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = blobUrl;
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 500);
    };
    document.body.appendChild(iframe);
  };

  const onCancel = () => {
    setVisible1(false);
  }

  return (
    <Modal title={null} footer={null} closable={true} open={visible1} centered={true} width={'297mm'} onCancel={onCancel}>
    <Overlay loading={loading}>
      <div className='inv_pdf_back'>
        <FaFilePdf className="inv_pdf_btn1" onClick={onPressExport}/>
        <BsFillPrinterFill className="inv_pdf_btn1" onClick={onPressPrint} style={{marginLeft: 0}}/>
      </div>
      <div className='line' style={{marginTop: 0}}/>
      {error && <Error error={error}/>}
      <div id="table_scroll" className="invoice_pdf_back1">
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
    </Overlay>
    </Modal>
  );
}
