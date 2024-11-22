// import React, { useState, useEffect } from 'react';
// import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
// import { useTranslation } from 'react-i18next';

// import { PaginationTable, Table, Empty1, ReportTable } from '../../../../../components/all';

// export function List(props){
//   const { data} = props;
//   const { t, i18n } = useTranslation();
//   const [columns, setColumns] = useState([]);

//   useEffect(() => {
//     setColumns([
//       {
//         Header: "Данс",
//         accessor: "account",
//         rowSpan:2
//       },
//       {
//         Header: "Харилцагч",
//         accessor: "customer",
//         rowSpan:2
//       },
//       {
//         Header: "Гүйлгээний утга",
//         accessor: "description",
//         rowSpan:2
//       },
//       {
//         Header: "Дүн",
//         colSpan: 2,
//         columns: [
//           {
//             Header: "Дебит",
//             accessor: "debit",
//           },
//           {
//             Header: "Кредит",
//             accessor: "credit",
//           },
//         ],
//       },
//     ]);
//     return () => {};
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [i18n?.language]);

//   // useEffect(() => {
//   //   setColumns([
//   //     { Header: t('time.t_emp'), columns: [{
//   //         Header: t('time.t_emp'), accessor: 'dans',
//   //         Header: t('time.t_emp'), accessor: 'dans1',
//   //     }]
//   //     },
//   //     { Header: t('time.t_site'), accessor: 'hariltsagch' },
//   //     { Header: <div>{t('time.t_total')}</div>, accessor: 'debit' },
//   //   ]);
//   //   return () => {};
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [i18n?.language]);

//   const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
//   const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
//     initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
//       }, useSortBy, usePagination, useRowSelect);
//   const tableProps = { tableInstance, hasTotal: true, total: data?.length};
//   const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

//   return (
//     <div className='i_list_cont_zz' id='invt_list_zz'>
//       {!data?.length ? <Empty1 {...emptyProps} /> : 
//       <>
//         <div className='table_scroll' style={{overflowX: 'scroll'}}>
//           <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
//             <ReportTable {...tableProps} />
//           </div>
//         </div>     
//         {/* <PaginationTable {...tableProps} /> */}
//        </>
//       }
//     </div>
//   );
// }
import React from 'react';
import html2pdf from "html2pdf.js";
import parse from "react-html-parser";

import { DynamicMDIcon } from '../../../../../components/all';

export function List(props){
    const { html } = props;

    const handleExport = () => {
        const element = document.getElementById("order_bo_pdf");
        const options = {
            // margin: 0,
            filename: "report.pdf",
            html2canvas: { scale: 2},//scrollY: 0
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(element).set(options).save();
    };

    const iframe = document.getElementById('order_bo_pdf');

    function zoomIn() {
      let scale = parseFloat(iframe.style.transform.replace("scale(", "").replace(")", "")) || 1;
      iframe.style.transform = `scale(${scale + 0.1})`; // Томруулах
    }

    function zoomOut() {
      let scale = parseFloat(iframe.style.transform.replace("scale(", "").replace(")", "")) || 1;
      iframe.style.transform = `scale(${scale - 0.1})`; // Багасгах
      iframe.style.transformOrigin = "top";
    }
  return (
    <div className='fi_pdf_back'>
        <div className='j_header_back'>
            {/* <button onClick={zoomIn}>+</button>
            <button onClick={zoomOut}>-</button> */}
            <DynamicMDIcon onClick={handleExport} name='MdOutlineFileDownload' className='download_icon'/>
        </div>              
        <div className='list_pdf_back'>
        <div id='order_bo_pdf' className="a4-layout">
          {parse(html)}
        </div>
            {/* <iframe id='order_bo_pdf' style={{width: "210mm", height: "297mm", border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}} srcDoc={html}></iframe> */}
        </div>
    </div>
  );
}