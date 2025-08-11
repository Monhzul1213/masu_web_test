import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

import { Button, IconButton, MonthRange } from '../../../../../components/all';
import customIcon from '../../../../assets/Asset 70 3.png';

export function Filter(props){
  const { size, onSearch, date, setDate, type, id, land} = props;
  const [classH, setClassH] = useState('fi_header_back');
  const { t } = useTranslation(); 

  useEffect(() => {
    if(size?.width >= 620) setClassH('fi_header_back');
    else if(size?.width < 620 && size?.width >= 420) setClassH('fi_header_back1');
    else setClassH('fi_header_back1');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onClick = () => {
    let query = {
      storedName: type, moduleID: "IN",
      business: [
        {fieldName: "BeginDate", value: date[0]?.format('yyyy.MM.DD')},
        {fieldName: "EndDate", value: date[1]?.format('yyyy.MM.DD')}
      ]
    };
    onSearch && onSearch(query);
  };

  const onHide = () => {
    console.log('');
  }

  const handleExport = () => {
    const element = document.getElementById(id);
    const opt = {
      margin: 0,
      filename: 'report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {scale: 2, useCORS: true},
      jsPDF: { unit: 'in', format: 'a4', orientation: land ? 'landscape' : 'portrait' },
    };
  
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf('blob')
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
  
        if (isSafari) {
          printUsingIframe(blobUrl);
        } else {
          const win = window.open('', '_blank');
          if (win) {
            win.document.write(`
              <html>
                <head><title>Print PDF</title></head>
                <body style="margin:0">
                  <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                  <script>
                    const interval = setInterval(() => {
                      if (document.readyState === 'complete') {
                        clearInterval(interval);
                        setTimeout(() => { window.print(); }, 500);
                      }
                    }, 200);
                  </script>
                </body>
              </html>
            `);
            win.document.close();
          } else {
            printUsingIframe(blobUrl);
          }
        }
      });
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
    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 500);
    };
    document.body.appendChild(iframe);
  };
  

  const dateProps = { value: date, setValue: setDate, onHide, classBack: 'fi_date_back', className: 'rp_date' };
  const btnProps = {text: t('finance.show'), className: 'fi_show_btn', onClick}

  return (
    <div className={classH}>
      <div className='rp_h_row1'>
        <MonthRange {...dateProps} />
        <Button {...btnProps}/>
      </div>
      <IconButton
        text={size?.width > 300 ? 'Хэвлэх' : ''}
        onClick={handleExport}
        icon={<img src={customIcon} alt="print icon" className="download_icon" />}
        className="download_icon_back"
      />      
    </div>
  );
}