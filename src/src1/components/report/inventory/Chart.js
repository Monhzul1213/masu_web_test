// import React, { useState, useEffect } from 'react';
// import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
// import { useTranslation } from 'react-i18next';
// import { PaginationTable, PlainSelect, MultiSelect , LineCharts} from '../../all/all_m';
// import { dayTypes, chartTypes } from '../../../../helpers/dummyData';

// export function Chart(props){
//   const { data} = props;
//   const { t, i18n } = useTranslation();
//   const [columns, setColumns] = useState([]);
//   const [type, setType] = useState({ value: 'line' });
//   const [day, setDay] = useState({ value: 'day' });

//   useEffect(() => {
//     setColumns([
//       { Header: t('report.name'), accessor: 'empName',
//     },
//       { Header: t('report.total_sales'), accessor: 'siteName' },
//       { Header: t('report.return'), accessor: 'siteNam' },
//       { Header: t('report.discount'), accessor: 'siteNae' },
//       { Header: t('report.net_sales'), accessor: 'siteNme' },
//       { Header: t('report.receipt'), accessor: 'siteNe' },
//       { Header: t('report.ave_sale'), accessor: 'iteName' },
//       {
//         Header: <div style={{textAlign: 'right'}}>{t('report.signed_up')}</div>, accessor: 'totalHours',
//         Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
//       },
//     ]);
//     return () => {};
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [i18n?.language]);

  

// const typeProps = { value: type, setValue: setType, data: chartTypes,  className: 'ch_select',  };
// const dayProps = { value: day, setValue: setDay, data: dayTypes,  className: 'ch_select',  };
//   return (
//     <div className='chart_z'>
//         <div className='top' >
//             <div className='header_text'>
//                 <p className='text'>Top 5</p>
//                 <p className='text'>net sales</p> 
//             </div>
//         </div>
//         <div className='divider'/>
//         <div className='chart_back '>
//           <div className='chart'>
//             <div>
//               <p className='text'></p>
//             </div>
//               <div className='chart_select'>    
//               <PlainSelect {...typeProps} />
//               {/* <PlainSelect {...dayProps} /> */}
//               </div>
//           </div>
//           <div className='line1'> 
//             {/* <LineCharts /> */}
//           </div>
//         </div>
//     </div>
//   );
// }