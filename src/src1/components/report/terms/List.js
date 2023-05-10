import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, FooterTable, Money } from '../../all/all_m';
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
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>, customStyle: { width: 100 }, Footer: t('report.total'),},
      { Header: t('page.date'), accessor: 'salesDate', exLabel: t('page.date'),
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)}
      },
      { Header: t('report.siteName'), accessor: 'siteName', exLabel: t('report.siteName'), customStyle: { width: 150 }, },
      { Header: t('report.pos'), accessor: 'terminalName', exLabel: t('report.pos'), customStyle: { width: 100 }, },
      { Header: t('report.type'), accessor: 'salesTypeName', exLabel: t('report.type'), customStyle: { width: 150 }, },
      { Header: t('report.empName'), accessor: 'cashierName', exLabel: t('report.empName'), customStyle: { width: 150 } },
      { Header: t('report.invtName'), accessor: 'invtName', exLabel: t('report.invtName'), customStyle: { width: 150 } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.price1')}</div>, accessor: 'price',  customStyle: { width: 100 }, 
      exLabel: t('report.price1'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.qty1')}</div>, accessor: 'qty',customStyle: { width: 60 },
      exLabel: t('report.qty1',),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0} </div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.qty + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
        } },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.amount')}</div>, accessor: 'amount',  customStyle: { width: 150 }, 
      exLabel: t('report.amount'), 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.amount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: t('report.descr'), accessor: 'serviceDescr', exLabel: t('report.descr') },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);




  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length };
  const filterProps = {columns, data, excelName };

  return (
    <div>
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