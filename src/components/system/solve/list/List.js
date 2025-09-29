import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PaginationTable, TableRowResize } from '../../../all';

export function List(props){
  const { data, onClickAdd, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: '#', accessor: 'merchantId', width: 70 },
      { Header: t('tax.customer'), accessor: 'merchant', width: 400 },
      { Header: t('invoices.batch'), accessor: 'bagts', width: 110 },
      {
        Header: t('tax.sent_date'), accessor: 'createdDate', width: 150,
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('tax.reg_no'), accessor: 'vatPayerNo', width: 120 },
      { Header: t('tax.name'), accessor: 'vatPayerName', width: 150 },
      { Header: t('tax.t_no'), accessor: 'tinID', width: 170 },
      {
        Header: t('tax.checked'), accessor: 'isVat', width: 120,
        Cell: ({ value }) => <div>{value === '1' ? t('page.yes') : t('page.no')}</div>
      },
      { Header: t('order.status'), accessor: 'statusName', width: 150},
      { Header: t('shop.descr'), accessor: 'descr', width: 120 },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);
  
  const onRowClick = row => onClickAdd(row?.original);

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 120, maxWidth: 600 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'createdDate', desc: true }] }}, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}