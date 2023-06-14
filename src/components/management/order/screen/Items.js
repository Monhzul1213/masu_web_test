import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';

import { Money, TableRow, TableRowResize } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';

export function Items(props){
  const { data, order } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', noSort: true, width: 160, minWidth: 90,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', noSort: true, width: 110, minWidth: 90 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', noSort: true, width: 90, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty1')}</div>, accessor: 'orderQty', noSort: true, width: 75, minWidth: 40,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base1')}</div>, accessor: 'orderTotalQty', noSort: true, width: 145, minWidth: 40,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}>{value}</div>,
        Footer: <div style={{textAlign: 'right'}}>{order?.totalQty}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', noSort: true, width: 100, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}><Money value={value} fontSize={14} /></div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_order')}</div>, accessor: 'totalCost', noSort: true, width: 120, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}><Money value={value} fontSize={14} /></div>,
        Footer: <div style={{textAlign: 'right'}}><Money value={order?.total} fontSize={14} /></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base_receipt')}</div>, accessor: 'receivedQty', noSort: true, width: 100, minWidth: 100,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}>{value}</div>,
        Footer: <div style={{textAlign: 'right'}}>{order?.receivedTotalQty}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_receipt')}</div>, accessor: 'receivedTotalCost', noSort: true, width: 120, minWidth: 100,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 5}}><Money value={value} fontSize={14} /></div>,
        Footer: <div style={{textAlign: 'right'}}><Money value={order?.receivedTotalCost} fontSize={14} /></div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn }, useSortBy, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, scrolling: true, hasFooter: true };

  return (
    <div className='ps_list_back' style={{overflowX: 'scroll'}}>
      <div style={{minWidth: 720}}>
        <p className='ps_title'>{t('inventory.title')}</p>
        <TableRowResize {...tableProps} />
      </div>
    </div>
  );
}