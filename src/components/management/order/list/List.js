import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';

import { PaginationTable, Money, TableResize } from '../../../all';
import { Progress } from './Progress';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('order.t_no'), accessor: 'poOrder.orderNo', width: 115, minWidth: 110 },
      {
        Header: t('order.date'), accessor: 'poOrder.orderDate', width: 145, minWidth: 140,
        Cell: ({ value }) => <div style={{}}>{moment(value).format('yyyy.MM.DD')}</div>
      },
      { Header: t('order.vend'), accessor: 'poOrder.vendName', width: 130, minWidth: 100 },
      { Header: t('order.site'), accessor: 'poOrder.siteName', width: 150, minWidth: 80 },
      {
        Header: t('order.status'), accessor: 'poOrder.statusName', width: 140, minWidth: 60,
        Cell: ({ value, row }) => {
          let status = row?.original?.poOrder?.status;
          let color = status === 0 ? 'var(--danger-color)' : status === 1 ? 'var(--text-color)' : 'var(--text2-color)';
          return <span style={{ color }}>{value}</span>
        }
      },
      {
        Header: t('order.t_received'), accessor: 'poOrder.percent', customStyle: { paddingTop: 0, paddingBottom: 0 }, width: 150, minWidth: 150,
        Cell: props => <Progress order={props?.row?.original?.poOrder} width={130} />
      },
      {
        Header: t('order.req'), accessor: 'poOrder.reqDate', width: 140, minWidth: 137,
        Cell: ({ value, row }) => {
          let expired = moment().add(-1, 'day').isAfter(moment(value, 'yyyy.MM.DD'));
          let danger = expired && (row?.original?.poOrder?.status === 0 || row?.original?.poOrder?.status === 1);
          return <div style={{ color: danger ? 'var(--danger-color)' : 'var(--text-color)' }}>{value}</div>
        }
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_order1')}</div>, accessor: 'poOrder.total',//orderAmount, orderPayment???
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, width: 140, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_receipt')}</div>, accessor: 'poOrder.receivedTotalCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, width: 140, minWidth: 140,
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

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'poOrder.orderNo', desc: true }] }}, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}