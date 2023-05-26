import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PaginationTable, Table , Money } from '../../all/all_m';
import { Header } from './Header';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.site'), accessor: 'siteName', exLabel: t('report.site'), customStyle: { width: 150 },},
      { Header: t('report.pos'), accessor: 'terminalName', exLabel: t('report.pos'), customStyle: { width: 100 },},
      { Header: t('page.date'), accessor: 'currentDate', exLabel: t('page.date'), customStyle: { width: 120 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
      { Header: t('report.empName'), accessor: 'cashierName', exLabel: t('report.empName'), customStyle: { width: 120 },},
      { Header: t('report.beginDate'), accessor: 'openDate', exLabel: t('report.beginDate'), 
      Cell: ({ value }) => {
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD hh:mm:ss') : ''}</div>)
      }},
      { Header: t('report.closedDate'), accessor: 'closeDate', exLabel: t('report.closedDate'),
      Cell: ({ value }) => {
        // console.log(value)
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD hh:mm:ss') : ''}</div>)
      }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.beginBalance')}</div>, accessor: 'beginBalance',
      exLabel: t('report.beginBalance'), customStyle: { width: 150 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,},
      { Header: <div style={{textAlign: 'right'}}>{t('report.sales_amt')}</div>, accessor: 'cashAmt',
      exLabel: t('report.sales_amt'), customStyle: { width: 160 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,},
      { Header: <div style={{textAlign: 'right'}}>{t('report.closedBalance')}</div>, accessor: 'closedBalance',
      exLabel: t('report.closedBalance'),
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,},
      { Header: <div style={{textAlign: 'right'}}>{t('report.diff')}</div>, accessor: 'diffAmount',
      exLabel: t('report.diff'), 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  
  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 90px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 70px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'OpenDate', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}