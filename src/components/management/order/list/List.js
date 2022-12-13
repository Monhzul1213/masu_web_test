import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';

import { formatNumber } from '../../../../helpers';
import { PaginationTable, Table } from '../../../all';
import { Progress } from './Progress';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('order.t_no'), accessor: 'poOrder.orderNo' },
      { Header: t('order.date'), accessor: 'poOrder.orderDate' },
      { Header: t('order.vend'), accessor: 'poOrder.vendName' },
      { Header: t('order.site'), accessor: 'poOrder.siteName' },
      {
        Header: t('order.status'), accessor: 'poOrder.statusName',
        Cell: ({ value }) => {
          let color = value === 0 ? 'var(--danger-color)' : value === 1 ? 'var(--text-color)' : 'var(--text2-color)';
          return <div style={{ color }}>{value}</div>
        }
      },
      {
        Header: t('order.t_received'), accessor: 'poOrder.percent', customStyle: { paddingTop: 0, paddingBottom: 0 },
        Cell: props => <Progress order={props?.row?.original?.poOrder} width={130} />
      },
      {
        Header: t('order.req'), accessor: 'poOrder.reqDate',
        Cell: ({ value, row }) => {
          let expired = moment().add(-1, 'day').isAfter(moment(value, 'yyyy.MM.DD'));
          let danger = expired && (row?.original?.poOrder?.status === 0 || row?.original?.poOrder?.status === 1);
          return <div style={{ color: danger ? 'var(--danger-color)' : 'var(--text-color)' }}>{value}</div>
        }
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total2')}</div>, accessor: 'poOrder.total',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(value)}</div>
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

  const onRowClick = row => {
    navigate({ pathname: 'order', search: createSearchParams({ orderNo: row?.original?.poOrder?.orderNo }).toString() });
  }

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