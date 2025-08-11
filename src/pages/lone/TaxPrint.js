import React from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import '../../css/bill.css';
import { Error, Overlay } from '../../components/all';
import { Header, Footer, Info, Items, ItemsHeader, Total, Pay } from '../../components/lone/tax';
import { Modal } from 'antd';

export function TaxPrint(props) {
  const {loading, error, header, account, detail, info, visible} = props;
  const { t } = useTranslation();
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
  
  

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={'210mm'}>
      <button className="inv_pdf_btn1" onClick={onClickPdf}>
        {t('order.pdf')}
      </button>
      <div className='line'/>
    <Overlay loading={loading}>
      {error && <Error error={error} />}
      <div id="list_scroll" className="invoice_pdf_back">
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
