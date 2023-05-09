import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useGlobalFilter } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon, Money } from '../../../all';
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
        Header: t('inventory.title'), accessor: 'name',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true },
      { Header: '', accessor: 'sku', customStyle: { display: 'none'}, Cell: () => (<div style={{display: 'none'}} />) },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'siteQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_incoming')}</div>, accessor: 'transitQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', isQty: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80 },//, autoFocus: true
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_base')}</div>, accessor: 'baseQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', isText: true, customStyle: { width: 100 },
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={15} /></div>,
        // customStyle: { width: 120, paddingRight: 18 }, width: 100
      },//, autoFocus: true
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total')}</div>, accessor: 'totalCost', isText: true, customStyle: { width: 100 },
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={15} /></div>,
      },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
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
        let baseQty = orderQty * old[rowIndex]?.batchQty;
        let totalCost = baseQty * old[rowIndex]?.cost;
        total += totalCost;
        return { ...old[rowIndex], orderQty, baseQty, totalCost, error: null };
      } else {
        total += row.totalCost;
        return row;
      }
    }));
    setTotal(total);
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.orderItemId !== -1) setDItems(old => [...old, row?.original]);
    let newTotal = total - (row?.original?.totalCost ?? 0);
    setTotal(newTotal);
    setItems(items?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }
  
  const newItem = invt => {
    return { orderItemId: -1, invtId: invt.invtId, name: invt.name, orderQty: 0, totalCost: 0, cost: invt.cost, siteQty: 0, transitQty: 0,
      invtCode: '', rowStatus: 'I', sku: invt?.sku, barCode: invt?.barCode, batchQty: invt?.batchQty ? invt?.batchQty : 1, baseQty: 0,
      allowDecimal: invt?.isEach === 'N' };
  }

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['sku']?.includes(query));
  }, []);

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const selectProps = { search, setSearch, data: items, setData: setItems, newItem };
  const tableInstance = useTable({ columns, data: items, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size };
  
  return (
    <div className='po_back_invt1'>
      <Search {...searchProps} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
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