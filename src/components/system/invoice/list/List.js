import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PaginationTable, Table } from '../../../all';

export function List(props){
  return (
    <div>
      List
    </div>
  );
}

/**
export function List(props){
  const { data, onClickAdd, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('tax.customer'), accessor: 'merchant' },
      {
        Header: t('tax.sent_date'), accessor: 'createdDate', customStyle: { minWidth: 120 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('tax.reg_no'), accessor: 'vatPayerNo' },
      { Header: t('tax.name'), accessor: 'vatPayerName', customStyle: { minWidth: 120 } },
      {
        Header: t('tax.checked'), accessor: 'isVat', customStyle: { minWidth: 120 },
        Cell: ({ value }) => <div>{value === '1' ? t('page.yes') : t('page.no')}</div>
      },
      { Header: t('order.status'), accessor: 'statusName' },
      { Header: t('shop.descr'), accessor: 'descr' },
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

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'createdDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}
 */