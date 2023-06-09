 import React, { useState, useEffect, useCallback } from 'react';
import { withSize } from 'react-sizeme';
import { useTable, usePagination, useRowSelect, useSortBy, useGlobalFilter } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Search } from '../add/Search';
import { Money, PaginationTable, Table } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';
import { EditableCell } from '../../../invt/inventory/add/EditableCell';

function Card(props){
  const { detail, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Нэгж өртөг - poOrderItem.Cost - Тоон утга өөрчлөх боломжтой 
    // Орлого авах тоо - Тоо оруулах талбар байна Max: Захиалсан нийт тоо
    // Орлогын дүн - Орлого авах тоо * Нэгж өртөг

    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 },
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', },
      { Header: '', accessor: 'sku', customStyle: { display: 'none'}, Cell: () => (<div style={{display: 'none'}} />) },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, customStyle: { width: 80} },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, customStyle: { width: 80} },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_base1')}</div>, accessor: 'orderTotalQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, customStyle: { width: 100} },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_total_order')}</div>, accessor: 'totalCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, customStyle: { width: 100} },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_base_receipt')}</div>, accessor: 'receivedQty', customStyle: { width: 100 }, width: 80,
        Cell: props => <EditableCell {...props} />, isQty: true
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost_unit')}</div>, accessor: 'cost', customStyle: { width: 100 }, width: 80,
        Cell: props => <EditableCell {...props} />, isMoney: true
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_total_receipt')}</div>, accessor: 'receivedTotalCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, customStyle: { width: 100} },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['sku']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    // e?.preventDefault();
    // let total = 0;
    // setItems(old => old.map((row, index) => {
    //   if(index === rowIndex){
    //     let orderQty = parseFloat(value ? value : 0);
    //     let orderTotalQty = divide(orderQty, old[rowIndex]?.batchQty, true);
    //     let totalCost = divide(orderTotalQty, old[rowIndex]?.cost, true);
    //     total = add(total, totalCost);
    //     setTotal(total);
    //     return { ...old[rowIndex], orderQty, orderTotalQty, totalCost, error: null };
    //   } else {
    //     total = add(total, row.totalCost);
    //     setTotal(total);
    //     return row;
    //   }
    // }));
    // setTotal(total);
    // // comment
    // setEdited && setEdited(true);
    // setSearch({ value: null });
  }

  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data: detail, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25 }, globalFilter: filterFunction, updateMyData },
    useGlobalFilter, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';

  return (
    <div className='po_back_invt1' style={{border: 'none'}}>
      <Search {...searchProps} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <div className={classPage}>
        <PaginationTable {...tableProps} />
        <div />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Items = withSizeHOC(Card);

/**
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { add, divide } from '../../../../helpers';
import { PaginationTable, Table, DynamicBSIcon, Money } from '../../../all';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';
import { EditableCell } from './EditableCell';

function Card(props){
  const { items, setItems, setDItems, size, setEdited, total, setTotal, search, setSearch } = props;

 

 */