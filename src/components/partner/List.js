import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy } from 'react-table';

import { Money, PaginationTable, Table } from '../all';

export function List(props){
  const { data } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.id')}</div>, accessor: 'merchantId', customStyle: { width: 90 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      { Header: t('tax.customer'), accessor: 'customer' , customStyle2: { width: 300 }},
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_qty')}</div>, accessor: 'subsciption_Count', customStyle: { width: 150 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_amount')}</div>, accessor: 'subsciption_Amount', customStyle: { width: 150 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('login.partner_amt')}</div>, accessor: 'partner_Amount', customStyle: { width: 150 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'invoiceDate', desc: true }] }}, useSortBy, usePagination);
  const tableProps = { tableInstance };

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