import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Money, PaginationTable, Table } from '../../../all';
import { Tax } from './Tax';

export function List(props){
  const { onClickAdd, data, size } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [visible, setVisible] = useState(false);
  const [invNo, setInvNo] = useState(null)
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setColumns([
      { Header: t('tax.customer'), accessor: 'label1' },
      { Header: t('invoice.invoice'), accessor: 'invoiceNo' },
      {
        Header: t('page.date'), accessor: 'invoiceDate', customStyle: { minWidth: 120 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('invoice.type'), accessor: 'invoiceType' },
      { Header: t('invoice.time'), accessor: 'invoiceTime' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('invoice.amount')}</div>, accessor: 'amount', customStyle: { width: 100 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      { Header: t('order.status'), accessor: 'statusName' },
      { Header: '', accessor: 'status', noSort: true, isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          let active = value === 3;
          return active && (<div className='table_link' onClick={() => onClickLink(row)}>{t('system.tax_sent')}</div>);
        }
      },
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

  const onClickLink = row => {
    setInvNo(row?.original?.invoiceNo)
    console.log(invNo)
    setVisible(true);
  }

  const onBack = () => {
    setVisible(false);
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, onClickLink,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'invoiceDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  let subProps = { visible, onBack, invNo };

  return (
    <div>
      <Tax {...subProps} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}