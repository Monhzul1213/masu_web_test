import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { PaginationTable, Table, Money } from '../../all';
import { Drawer } from './Drawer';

export function List(props){
  const { data, size, loading, tab } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setColumns([
      { Header: t('report_receipt.t_no'), accessor: 'sale.salesNo' },
      {
        Header: t('page.date'), accessor: 'sale.createdDate',
        Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD HH:mm')}</div>)
      },
      { Header: t('time.t_site'), accessor: 'sale.siteName' },
      { Header: t('time.t_emp'), accessor: 'sale.cashierName' },
      { Header: t('report_receipt.t_user'), accessor: 'sale.custName' },
      { Header: t('report_receipt.t_type'), accessor: 'sale.salesTypeName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'sale.totalSalesAmount', customStyle: { width: 100 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.ddtd')}</div>, accessor: 'sale.vatDdtd' ,
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      { Header: t('report_receipt.customerID'), accessor: 'sale.vatCustomerId' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 117px - 38px - 39px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 117px - 38px - 39px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

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
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.createdDate', desc: true }] }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  const drawerProps = { selected, open, setOpen };

  return (
    <div>
      <Drawer {...drawerProps} />
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}