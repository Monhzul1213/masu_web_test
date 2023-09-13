import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import moment from 'moment';

import { Money, PaginationTable, Table } from '../../all';

export function EmpList(props){
  const { data, width, hasData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('invoices.employee'), accessor: 'empName' },
      { Header: t('invoices.invoice'), accessor: 'invoiceNo' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('invoices.amt')}</div>, accessor: 'amount', customStyle: { width: 100 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div>)
      },
      {
        Header: t('invoices.begin'), accessor: 'beginDate', customStyle: { minWidth: 110 },
        Cell: ({ value }) => value ? (<div>{moment(value).format('yyyy.MM.DD')}</div>) : ''
      },
      {
        Header: t('invoices.end'), accessor: 'endDate', customStyle: { minWidth: 120 },
        Cell: ({ value }) => value ? (<div>{moment(value).format('yyyy.MM.DD')}</div>) : ''
      },
      { Header: t('invoices.status'), accessor: 'statusnName' },
      {
        Header: '', accessor: 'empCode', noSort: true, isBtn: true, customStyle: { maxWidth: 140, minWidth: 140 },
        Cell: ({ value, row, onClickLink }) => {
          return (<div className='table_link' onClick={() => onClickLink(row)}>{t('invoices.extend')}</div>);
        }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickLink = row => {
    // comment
    // setVisible(true);
    // setSite(row?.original);
  }

  const maxHeight = hasData
    ? 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 45px)'
    : 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickLink },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: () => {} };

  return (
    <div className='mo_container' style={{ width }}>
      <p className='card_title'>{t('invoices.employee')}</p>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}