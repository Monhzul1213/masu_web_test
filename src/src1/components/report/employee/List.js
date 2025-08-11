import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Money, TableRowResize } from '../../../../components/all';
import { Header } from './Header';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight ] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.name'), accessor: 'empName', exLabel: t('report.name'), width: 140, minWidth: 75,
        Footer: <div style={{textAlign: 'left'}}>{t('report.total') + data?.length}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.total_sales')}</div>, accessor: 'totalSalesAmt',
      exLabel: t('report.total_sales') , width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalSalesAmt + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmt' ,
      exLabel: t('report.refund'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalReturnAmt + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.net_sales')}</div> , accessor: 'totalNetSalesAmt',
      exLabel: t('report.net_sales'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div> ,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalNetSalesAmt + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total}/>} </div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.discount')}</div>, accessor: 'totalDiscAmt' ,
      exLabel: t('report.discount'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalDiscAmt + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total}  />} </div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.receipt')}</div>, accessor: 'receipts',
      exLabel: t('report.receipt'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0} </div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.receipts + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{total} </div></>
      } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.ave_sale')}</div>, accessor: 'averageAmt',
      exLabel: t('report.ave_sale'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value}/></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.averageAmt + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total}/>}</div></>
      } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.itemQtySum')}</div>, accessor: 'totalItemQty',
      exLabel: t('report.itemQtySum'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalItemQty + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{total}</div></>
      } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.itemCount')}</div>, accessor: 'totalItemCount', 
      exLabel: t('report.itemCount'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalItemCount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{total}</div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.customer')}</div>, accessor: 'customerQty',
       exLabel: t('report.customer'), width: 150, minWidth: 75,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0}</div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 90px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 70px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination, useBlockLayout, useResizeColumns );
  const tableProps = { tableInstance, hasFooter: true  };
  const filterProps = {columns, data, excelName};

  return (
    <div>
      <Header {...filterProps} />
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 520}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
    </div>
  );
}