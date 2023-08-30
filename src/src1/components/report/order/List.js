import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PaginationTable, TableResize, Money } from '../../all/all_m';
import { Header } from './Header';
import { Drawer } from './Drawer';

export function List(props){
  const { data, size, loading, tab, excelName, filter, data1} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 117px - 38px - 60px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 117px - 38px - 39px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', Footer: t('report.total'), exLabel: t('page.date'), width: 100, minWidth: 90 ,
        Cell: ({ value }) => {
          return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
        }
      },
      { Header: t('time.t_site'), accessor: 'siteName', exLabel: t('time.t_site'), width: 130, minWidth: 90 ,},
      { Header: t('pos.title'), accessor: 'terminalName', exLabel: t('pos.title'), width: 80, minWidth: 70 , },
      { Header: t('orders.location'), accessor: 'ticketBinName', exLabel: t('orders.location'), width: 130, minWidth: 80 },
      { Header: t('time.t_emp'), accessor: 'cashierName', exLabel: t('time.t_emp'), width: 100, minWidth: 80  },
      { Header: t('report_receipt.t_type'), accessor: 'salesTypeName', exLabel: t('report_receipt.t_type'), width:100, minWidth: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('report.amount')}</div>, accessor: 'totalAmount' , width: 100, minWidth: 90 ,
       exLabel: t('report.amount'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.discount')}</div>, accessor: 'totalDiscountAmount' , 
        exLabel: t('report.discount'), width: 100, minWidth: 90 ,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalDiscountAmount + sum, 0),
            [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.salesAmount')}</div>, accessor: 'totalSalesAmount' , 
      exLabel: t('report.salesAmount'), width: 100, minWidth: 90,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalSalesAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } }, 
        { Header: <div style={{textAlign: 'right'}}>{t('report.cash')}</div>, accessor: 'totalCashAmount' , 
        exLabel: t('report.cash'), width: 100, minWidth: 90,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalCashAmount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
        { Header: <div style={{textAlign: 'right'}}>{t('report.non_cash')}</div>, accessor: 'totalNonCashAmount' , 
        exLabel: t('report.non_cash'), width: 100, minWidth: 90,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalNonCashAmount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
          } },
        { Header: t('report_receipt.t_type'), accessor: 'descr', exLabel: t('report_receipt.t_type'), width: 90, minWidth: 90 },
    ])
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

    useEffect(() => {
    setOpen(false);
    setSelected(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tab]);

  const onRowClick = row => {
    setSelected(row?.original);
    setOpen(true);
  }

  const defaultColumn = useMemo(() => ({ minWidth: 60, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect, useResizeColumns, useBlockLayout);
  const tableProps = { tableInstance, onRowClick, hasTotal: true , total: data?.length };
  const filterProps = {columns, data, excelName , size , filter, };
  const drawerProps = { selected, open, setOpen , data1};

  return (
    <div>
      <Drawer {...drawerProps} />
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
