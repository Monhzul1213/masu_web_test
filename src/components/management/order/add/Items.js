import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useGlobalFilter, useBlockLayout, useResizeColumns } from 'react-table';
import { withSize } from 'react-sizeme';

import { add, divide } from '../../../../helpers';
import { PaginationTable, DynamicBSIcon, Money, TableResize } from '../../../all';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';
import { Search } from './Search';
import { EditableCell } from './EditableCell';

function Card(props){
  const { items, setItems, setDItems, size, setEdited, total, setTotal, search, setSearch } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 }, width: 160, minWidth: 90,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 110, minWidth: 90 },
      // { Header: '', accessor: 'sku', customStyle: { display: 'none'}, Cell: () => (<div style={{display: 'none'}} />), width: 0 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'siteQty', width: 100, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_incoming')}</div>, accessor: 'siteOrderQty', width: 120, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value ?? 0}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', width: 105, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value ?? 0}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', isQty: true,
        Cell: props => <EditableCell {...props} />, width: 130, minWidth: 130, maxWidth: 130 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base')}</div>, accessor: 'orderTotalQty', width: 160, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value ?? 0}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', width: 120, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={15} /></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total')}</div>, accessor: 'totalCost', width: 130, minWidth: 120,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={15} /></div>,
      },
      { id: 'delete', noSort: true, Header: '', width: 40, minWidth: 40, maxWidth: 40,
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let total = 0;
    setItems(old => old.map((row, index) => {
      if(index === rowIndex){
        let orderQty = parseFloat(value ? value : 0);
        let orderTotalQty = divide(orderQty, old[rowIndex]?.batchQty, true);
        let totalCost = divide(orderTotalQty, old[rowIndex]?.cost, true);
        total = add(total, totalCost);
        setTotal(total);
        return { ...old[rowIndex], orderQty, orderTotalQty, totalCost, error: null };
      } else {
        total = add(total, row.totalCost);
        setTotal(total);
        return row;
      }
    }));
    setTotal(total);
    // comment
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.orderItemId !== -1) setDItems(old => [...old, row?.original]);
    let newTotal = add(total, (row?.original?.totalCost ?? 0), true);
    setTotal(newTotal);
    setItems(items?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }
  
  const newItem = invt => {
    return { orderItemId: -1, invtId: invt.invtId, name: invt.name, orderQty: 0, totalCost: 0, cost: invt.cost,
      siteQty: invt?.siteQty, siteOrderQty: invt?.siteOrderQty,
      invtCode: '', rowStatus: 'I', sku: invt?.sku, barCode: invt?.barCode, batchQty: invt?.batchQty ? invt?.batchQty : 1, orderTotalQty: 0,
      allowDecimal: invt?.isEach === 'N' };
  }

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const selectProps = { search, setSearch, data: items, setData: setItems, newItem };
  const tableInstance = useTable({ columns, data: items, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size };
  
  return (
    <div className='po_back_invt1'>
      <Search {...searchProps} />
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <TableResize {...tableProps} />
      </div>
      <ItemSelect {...selectProps} />
      <div className={classPage}>
        <PaginationTable {...tableProps} />
        <div />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Items = withSizeHOC(Card);