import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Header } from './Header';
import { TableRowResize, Money } from '../../../../components/all';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight ] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: <div >{t('report.site')}</div>, accessor: 'siteName', width: 200, minWidth: 110 , exLabel: t('report.site'),
      Footer:  <div style={{textAlign: 'left', paddingRight: 15}}>{t('report.total') + data?.length }</div>  },
      { Header: <div >{t('report.date')}</div>, accessor: 'salesDate' , width: 100, minWidth: 90 , exLabel: t('report.date'), 
      Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)},
      { Header: <div style={{textAlign: 'right'}}>{t('report.total_sales')}</div> , accessor: 'totalSalesAmount', exLabel: t('report.total_sales'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div> , customStyle: { width: 150 },
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalSalesAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmount' , exLabel: t('report.refund'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div>, customStyle: { width: 150 },
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalReturnAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.noat')}</div>, accessor: 'totalVatAmount', exLabel: t('report.noat'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div> , customStyle: { width: 150 },
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalVatAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      }},
      { Header:  <div style={{textAlign: 'right'}}>{t('report.nhat')}</div>, accessor: 'totalNHATAmount', exLabel: t('report.nhat'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} /></div>, customStyle: { width: 150 }, 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalNHATAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
      }},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 117px - 38px - 39px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 117px - 38px - 39px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const defaultColumn = useMemo(() => ({ minWidth: 60, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn,  autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, hasFooter: true };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 520}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
    </div>
  );
}