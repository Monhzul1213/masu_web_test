import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import { useTranslation } from 'react-i18next';

import { PaginationTable, Money, TableRowResize } from '../../../../components/all';
import { Header } from './Header';
import moment from 'moment';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 80px )');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 80px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    setColumns([
      { Header: <div style={{textAlign: 'right'}}>{t('report.salesNo')}</div> , accessor: 'salesNo', exLabel: t('report.salesNo'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>, width: 100, minWidth: 110 , Footer: t('report.total') + data?.length},
      { Header: t('page.date'), accessor: 'salesDate', exLabel: t('page.date'), width: 100, minWidth: 110 ,
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)}
      },
      { Header: t('report.siteName'), accessor: 'siteName', exLabel: t('report.siteName'), width: 150, minWidth: 80 , },
      { Header: t('report.pos'), accessor: 'terminalName', exLabel: t('report.pos'), width: 150, minWidth: 80 , },
      { Header: t('report.type'), accessor: 'salesTypeName', exLabel: t('report.type'), width: 100, minWidth: 80 ,},
      { Header: t('report.empName'), accessor: 'cashierName', exLabel: t('report.empName'), width: 100, minWidth: 80 , },
      { Header: t('report.invtName'), accessor: 'invtName', exLabel: t('report.invtName'), width: 120, minWidth: 80 , },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.price1')}</div>, accessor: 'price', width: 100, minWidth: 80, 
      exLabel: t('report.price1'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.qty1')}</div>, accessor: 'qty', width: 100, minWidth: 80 ,
      exLabel: t('report.qty1',),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0} </div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.qty + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
        } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.amount')}</div>, accessor: 'amount', width: 90, minWidth: 70 , 
      exLabel: t('report.amount'), 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.amount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: t('report.descr'), accessor: 'serviceDescr', exLabel: t('report.descr'), width: 100, minWidth: 70 ,},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);



  const defaultColumn = useMemo(() => ({ minWidth: 60, width: 190, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect, useResizeColumns, useBlockLayout);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length, hasFooter: true };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
      <div className='table_scroll' style={{overflow: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}