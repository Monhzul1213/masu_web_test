import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Modal } from 'antd';
import { FaFilePdf } from "react-icons/fa6";
import { BsFillPrinterFill } from "react-icons/bs";
import html2pdf from 'html2pdf.js';

import '../../css/bill.css';
import { Error, Overlay } from '../../components/all';
import { Header, Footer, Info, Items, ItemsHeader, Total, Pay } from '../../components/lone/tax';


export function TaxPrint(props) {
  const {loading, error, header, account, detail, info, visible, setVisible} = props;
  // const { t } = useTranslation();
    // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [header, setHeader] = useState(null);
  // const [detail, setDetail] = useState(null);
  // const [info, setInfo] = useState(null);
  // const [account, setAccount] = useState([]);
  // const [searchParams] = useSearchParams();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   getData();
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
  //     const headerData = response?.data?.retdata?.sales?.[0];
  //     if (headerData) {
  //       headerData.pureAmount =
  //         (headerData.totalSalesAmount ?? 0) -
  //         (headerData.totalVatAmount ?? 0) -
  //         (headerData.totalNhatamount ?? 0);
  //     }
  //     setHeader(headerData);
  //     setDetail(response?.data?.retdata?.salesitem);
  //     setInfo(response?.data?.retdata?.bill);
  //     setAccount(response?.data?.retdata?.invdtl);
  //   }
  //   setLoading(false);
  // };

  const onClickPdf = () => {
    try {
      const body = document.getElementById('invoice_body');
      const footer = document.getElementById('invoice_footer');
  
      const pageHeightMM = 297; 
      const imgWidthMM = 210;
      const footerHeightMM = 40;
      const marginLeftMM = 5;
      const marginTopMM = 5;
      
      html2canvas(body, { scale: 2 }).then((canvasBody) => {
        const imgHeightMM = (canvasBody.height * imgWidthMM) / canvasBody.width;
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        let heightLeft = imgHeightMM;
        let position = 0;
        const pageContentHeightMM = pageHeightMM - footerHeightMM - 10;
  
        const addFooterToPage = (pdfDoc) => {
          return html2canvas(footer, { scale: 2 }).then((canvasFooter) => {
            const footerData = canvasFooter.toDataURL('image/png');
            pdfDoc.addImage(
              footerData,
              'PNG',
              marginLeftMM,
              pageHeightMM - footerHeightMM- marginTopMM,
              imgWidthMM,
              footerHeightMM
            );
          });
        };
  
        const processPages = async () => {
          let isFirstPage = true;
  
          while (heightLeft > 0) {
            const pageCanvas = document.createElement('canvas');
            const pageHeightPx = pageContentHeightMM * (canvasBody.width / imgWidthMM);
            pageCanvas.width = canvasBody.width;
            pageCanvas.height = Math.min(canvasBody.height - position, pageHeightPx);
  
            const ctx = pageCanvas.getContext('2d');
            ctx.putImageData(
              canvasBody.getContext('2d').getImageData(
                0,
                position,
                canvasBody.width,
                Math.min(canvasBody.height, pageHeightPx)
              ),
              0,
              0
            );
  
            const imgData = pageCanvas.toDataURL('image/png');
  
            if (!isFirstPage) pdf.addPage();
            pdf.addImage(
              imgData,
              'PNG',
              marginLeftMM, 
              marginTopMM,
              imgWidthMM - (marginLeftMM * 2),
              pageCanvas.height * ((imgWidthMM - marginLeftMM * 2) / canvasBody.width) 
            );
  
            await addFooterToPage(pdf);
  
            heightLeft -= pageContentHeightMM;
            position += pageContentHeightMM * (canvasBody.width / imgWidthMM);
            isFirstPage = false;
          }
  
          pdf.save('Зарлагын баримт A4'  + '.pdf');
        };
  
        processPages();
      });
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
      // Өндөрг тэлж бүх агуулгыг харагдуулна
      container.style.height = container.scrollHeight + 'px';
      container.style.maxHeight = 'none';
      container.style.overflow = 'visible';
  
      // React болон браузер шинэчлэл хийгдэхийг хүлээх
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const options = {
        margin: 0,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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
      console.eror('PDF print error:', error);
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
    setVisible(false);
  }

  return (
    <Modal title={null} footer={null} closable={true} open={visible} centered={true} width={'210mm'} onCancel={onCancel}>
      <div className='inv_pdf_back'>
        <FaFilePdf className="inv_pdf_btn1" onClick={onClickPdf}/>
        <BsFillPrinterFill className="inv_pdf_btn1" onClick={onPressPrint} style={{marginLeft: 0}}/>
      </div>
      <div className='line' style={{marginTop: 0}}/>
      <Overlay loading={loading}>
        {error && <Error error={error} />}
        <div id="table_scroll" className="invoice_pdf_back">
          <div id="invoice_body">
          <Header header={header} isA4={true} />
          <Info header={header} isA4={true} />
          <ItemsHeader />
          <Items detail={detail} />
          <Total header={header} />
          <Pay header={header} />
          </div>
          <div id="invoice_footer">
            <Footer info={info} accounts={account} isA4={true} />
          </div>
        </div>
      </Overlay>
    </Modal>
  );
}
