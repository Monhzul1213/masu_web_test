 import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { withSize } from 'react-sizeme';
import { useTable, usePagination, useRowSelect, useSortBy, useGlobalFilter, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';

import { add, divide } from '../../../../helpers';
import { Error1, Money, PaginationTable, TableResize } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';
import { EditableCell } from '../../../invt/inventory/add/EditableCell';
import { Footer } from './Footer';
import { Search } from './Search';

function Card(props){
  const { header, detail, setDetail, setEdited, total, setTotal, disabled, setDisabled, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 }, width: 160, minWidth: 90,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 110, minWidth: 90 },
      // { Header: '', accessor: 'sku', customStyle: { display: 'none'}, Cell: () => (<div style={{display: 'none'}} />) },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', width: 105, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value ?? 0}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', width: 125, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_base1')}</div>, accessor: 'orderTotalQty', width: 160, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, customStyle: { width: 100} },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_total_order')}</div>, accessor: 'totalCost', width: 140, minWidth: 120,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, customStyle: { width: 100} },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base_receipt')}</div>, accessor: 'receivedQty', width: 120, minWidth: 120, maxWidth: 120,
        Cell: props => <EditableCell {...props} />, isQty: true
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost_unit')}</div>, accessor: 'cost', width: 120, minWidth: 120, maxWidth: 120,
        Cell: props => <EditableCell {...props} />, isMoney: true
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_total_receipt')}</div>, accessor: 'receivedTotalCost', width: 130, minWidth: 120,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, customStyle: { width: 100} },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['invtName']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let total = 0;
    setDetail(old => old.map((row, index) => {
      if(index === rowIndex){
        let receivedQty = columnId === 'receivedQty' ? parseFloat(value ? value : 0) : old[rowIndex]?.receivedQty;
        if(receivedQty <= old[rowIndex]?.orderTotalQty){
          let cost = columnId === 'cost' ? parseFloat(value ? value : 0) : old[rowIndex]?.cost;
          let receivedTotalCost = divide(receivedQty, cost, true);
          total = add(total, receivedTotalCost);
          setError(null);
          setDisabled(false);
          return { ...old[rowIndex], receivedQty, cost, receivedTotalCost, error: null };
        } else
          setDisabled(true);
          setError(t('order.order_error'));
          return { ...old[rowIndex], receivedQty, error: 'receivedQty' };
      } else {
        total = add(total, row.receivedTotalCost);
        return row;
      }
    }));
    let discount = divide(divide(total, 100), header?.discountPercent, true);
    let left = add(total, discount, true);
    setTotal({ total, discount, left });
    setEdited && setEdited(true);
  }

  const onClickAll = e => {
    e?.preventDefault();
    let total1 = 0;
    setDetail(old => old.map((row, index) => {
      row.receivedQty = row.orderTotalQty;
      row.receivedTotalCost = divide(row.receivedQty, row.cost, true);
      row.error = null;
      total1 = add(total1, row.receivedTotalCost);
      return row;
    }));
    setError(null);
    let discount = divide(divide(total1, 100), header?.discountPercent, true);
    let left = add(total1, discount, true);
    setTotal({ total: total1, discount, left });
    setDisabled(false);
    setEdited && setEdited(true);
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data: detail, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25 }, globalFilter: filterFunction, updateMyData, disabled },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size, onClickAll };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const footerProps = { total };

  return (
    <div className='po_back_invt1' style={{border: 'none', paddingBottom: 0}}>
      <Search {...searchProps} />
      {error && <Error1 error={error} />}
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <TableResize {...tableProps} />
      </div>
      <div className={classPage}>
        <PaginationTable {...tableProps} />
        <Footer {...footerProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Items = withSizeHOC(Card);