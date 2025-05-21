import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import moment from 'moment';

import { Money, PaginationTable, Table } from '../../all';
import { Subscription } from '../../management/adjust/list';

export function SiteList(props){
  const { data, width, hasData, getData, setError } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setColumns([
      { Header: t('invoices.batch'), accessor: 'subscriptionType', customStyle: { minWidth: 130 } },
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
      { Header: t('invoices.status'), accessor: 'statusName', customStyle: { minWidth: 120 },
        Cell: ({ value, row }) => <div style={{ display: 'flex', fontWeight: '500', color: 'white', backgroundColor: row?.original?.status === 1 ? '#4baf4f' : row?.original?.status === 0 ? '' : 'var(--btn-color)', padding: '3px 10px', borderRadius: 20, justifyContent: 'center'}}>{value}</div> },
      {
        Header: '', accessor: 'status', noSort: true, isBtn: true, customStyle: { maxWidth: 140, minWidth: 140 },
        Cell: ({ value, row, onClickLink }) => {
          let active = value !== 1;
          return (<div className='table_link' onClick={() => onClickLink(row)}>{t(!active ? 'invoices.extend' : 'invoices.pay')}</div>);
        }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickLink = row => {
    setVisible(true);
    setSelected(row?.original);
    setError(null);
  }

  const onDone = () => {
    setVisible(false);
    setSelected(null);
    getData && getData();
  }

  const maxHeight = hasData
    ? 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 45px)'
    : 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickLink },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: () => {} };
  const subProps = { visible, setVisible, site: selected, onDone, noTrial: true, noBack: true, fromSite: true };

  return (
    <div className='mo_container' style={{ width }}>
      {visible && <Subscription {...subProps} />}
      <p className='card_title'>{t('invoices.invoices')}</p>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}