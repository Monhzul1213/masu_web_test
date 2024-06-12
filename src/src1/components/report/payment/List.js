import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import { useTranslation } from 'react-i18next';
import { Money, PaginationTable, TableResize } from '../../all/all_m';
import { formatNumber } from '../../../../helpers';
import { Header } from './Header';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 70px )');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 70px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    setColumns([
      { Header: <div >{t('report.site')}</div>, accessor: 'siteName', width: 150, minWidth: 110 ,
       Footer: t('report.total'), exLabel: t('report.site') },
      { Header: <div >{t('time.t_emp')}</div>, accessor: 'cashierCode', customStyle: { width: 200 },  exLabel: t('time.t_emp') },
      { Header: t('report.pay_type'), accessor: 'paymentTypeName' , exLabel: t('report.pay_type') , customStyle: { width: 250 } }, 
      { Header: <div style={{textAlign: 'right'}}>{t('report.pay_trans')}</div> , accessor: 'paymentTranscation', 
      customStyle: { width: 100 }, exLabel: t('report.pay_trans'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value} </div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.paymentTranscation + sum, 0),
          [info.rows]  )
        return <> <div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
       } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.pay_amt')}</div>, accessor: 'paymentAmount',
      customStyle: { width: 150 }, exLabel: t('report.pay_amt'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.paymentAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={15} /></div></>
       }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund_trans')}</div>, accessor: 'refundTransaction' , 
      customStyle: { width: 120 }, exLabel: t('report.refund_trans'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.refundTransaction + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
       } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund_amt')}</div>, accessor: 'refundAmount', 
      customStyle: { width: 120 }, exLabel: t('report.refund_amt'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> ,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.refundAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={15} /></div> </>
       }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.net_sales')}</div>, accessor: 'netAmount', 
      customStyle: { width: 150 }, exLabel: t('report.net_sales'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.netAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
       } },
      
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect,  useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}