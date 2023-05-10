import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, FooterTable, Money } from '../../all/all_m';
import { Header } from './Header';
import { Drawer } from './Drawer';
import moment from 'moment';

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
      { Header: t('page.date'), accessor: 'salesDate', Footer: t('report.total'), exLabel: t('page.date'),
        Cell: ({ value }) => {
          return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
        }
      },
      { Header: t('time.t_site'), accessor: 'siteName', exLabel: t('time.t_site') },
      { Header: t('pos.title'), accessor: 'terminalName', exLabel: t('pos.title') },
      { Header: t('orders.location'), accessor: 'ticketBinName', exLabel: t('orders.location') },
      { Header: t('time.t_emp'), accessor: 'cashierName', exLabel: t('time.t_emp') },
      { Header: t('report_receipt.t_type'), accessor: 'salesTypeName', exLabel: t('report_receipt.t_type') },
      { Header: <div style={{textAlign: 'right'}}>{t('report.amount')}</div>, accessor: 'totalAmount' , 
      customStyle: { width: 120 }, exLabel: t('report.amount'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.discount')}</div>, accessor: 'totalDiscountAmount' , 
        customStyle: { width: 120 }, exLabel: t('report.discount'),
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalDiscountAmount + sum, 0),
            [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
      } },
    { Header: <div style={{textAlign: 'right'}}>{t('report.salesAmount')}</div>, accessor: 'totalSalesAmount' , 
    customStyle: { width: 120 }, exLabel: t('report.salesAmount'),
    Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
    Footer: info => {
      const total = React.useMemo(() =>
        info.rows.reduce((sum, row) => row.values.totalSalesAmount + sum, 0),
        [info.rows]  )
      return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.cash')}</div>, accessor: 'totalCashAmount' , 
      customStyle: { width: 120 }, exLabel: t('report.cash'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalCashAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.non_cash')}</div>, accessor: 'totalNonCashAmount' , 
      customStyle: { width: 120 }, exLabel: t('report.non_cash'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalNonCashAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: t('report_receipt.t_type'), accessor: 'descr', exLabel: t('report_receipt.t_type') },
    ]);
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

  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick, hasTotal: true , total: data?.length };
  const filterProps = {columns, data, excelName , size , filter, };
  const drawerProps = { selected, open, setOpen , data1};

  return (
    <div>
      <Drawer {...drawerProps} />
      <Header {...filterProps} />
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <FooterTable {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}
