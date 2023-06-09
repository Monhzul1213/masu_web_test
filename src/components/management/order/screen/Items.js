import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, useSortBy } from 'react-table';

import { Money, TableRow } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';

export function Items(props){
  const { data, order } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', noSort: true,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', noSort: true },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty1')}</div>, accessor: 'orderQty', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base1')}</div>, accessor: 'orderTotalQty', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}>{value}</div>,
        Footer: <div style={{textAlign: 'right'}}>{order?.totalQty}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}><Money value={value} fontSize={14} /></div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_order')}</div>, accessor: 'totalCost', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}><Money value={value} fontSize={14} /></div>,
        Footer: <div style={{textAlign: 'right'}}><Money value={order?.total} fontSize={14} /></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base_receipt')}</div>, accessor: 'receivedQty', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}>{value}</div>,
        Footer: <div style={{textAlign: 'right'}}>{order?.receivedTotalQty}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total_receipt')}</div>, accessor: 'receivedTotalCost', noSort: true,
        Cell: ({ value }) => <div style={{textAlign: 'right'}}><Money value={value} fontSize={14} /></div>,
        Footer: <div style={{textAlign: 'right'}}><Money value={order?.receivedTotalCost} fontSize={14} /></div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const tableInstance = useTable({ columns, data }, useSortBy);
  const tableProps = { tableInstance, scrolling: true, hasFooter: true };

  return (
    <div className='ps_list_back' style={{overflowX: 'scroll'}}>
      <div style={{minWidth: 720}}>
        <p className='ps_title'>{t('inventory.title')}</p>
        <TableRow {...tableProps} />
      </div>
    </div>
  );
}