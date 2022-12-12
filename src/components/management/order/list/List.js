import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { PaginationTable, Table } from '../../../all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('order.t_no'), accessor: 'poOrder.orderNo' },
      { Header: t('order.date'), accessor: 'poOrder.orderDate' },
      { Header: t('order.vend'), accessor: 'poOrder.vendName' },
      { Header: t('order.site'), accessor: 'poOrder.siteName' },
      { Header: t('order.status'), accessor: 'poOrder.statusName' },
      { Header: t('order.t_received'), accessor: 'poOrder.totalQty' },//progress?????????
      { Header: t('order.req'), accessor: 'poOrder.reqDate' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total2')}</div>, accessor: 'poOrder.total',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 830) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    else if(size?.width < 830 && size?.width >= 640) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = row => console.log(row);

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'poOrder.orderNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
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
  )
}