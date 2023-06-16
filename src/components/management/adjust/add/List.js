import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';

import { DynamicBSIcon, Money, PaginationTable, TableResize } from '../../../all';
import { Search } from '../../order/add/Search';
import { ItemSelect } from './SelectItem';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';
import { SelectableCell } from '../../../invt/inventory/add/EditableCell';
import { EditableCell as EditableCellQty } from '../../order/add/EditableCell';
import { EditableCell } from './EditableCell';

function Card(props){
  const { size, detail, setDetail, search, setSearch, siteId } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [types] = useState([{ label: 'Орлого', value: 'RC' }, { label: 'Зарлага', value: 'II' }])

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 }, width: 160, minWidth: 90,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 110, minWidth: 90 },
      {
        Header: t('adjust.t_type'), accessor: 'itemType', isBtn: true, width: 120, minWidth: 90,
        Cell: props => <SelectableCell {...props} data={types} />
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'siteQty', width: 100, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty1')}</div>, accessor: 'qty', isQty: true,
        Cell: props => <EditableCellQty {...props} />, width: 130, minWidth: 130, maxWidth: 130
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost',
        Cell: props => <EditableCell {...props} />, width: 130, minWidth: 130, maxWidth: 130
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total')}</div>, accessor: 'totalCost', width: 130, minWidth: 120,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={15} /></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_left')}</div>, accessor: 'leftQty', width: 150, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      { id: 'delete', noSort: true, Header: '', width: 40, minWidth: 40, maxWidth: 40,
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    // comment
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

  const onClickDelete = row => {
    // comment
    // if(row?.original?.orderItemId !== -1) setDItems(old => [...old, row?.original]);
    // let newTotal = add(total, (row?.original?.totalCost ?? 0), true);
    // setTotal(newTotal);
    // setItems(items?.filter(item => item?.invtId !== row?.original?.invtId));
    // setSearch({ value: null });
  }

  const newItem = invt => {
    return {
      name: invt.name, invtId: invt.invtId, invtID: invt.invtId, sku: invt?.sku, barCode: invt?.barCode, allowDecimal: invt?.isEach === 'N',
      itemType: 'II', siteQty: invt?.siteQty, qty: 0, cost: invt.cost, origCost: invt.cost, leftQty: invt?.siteQty, totalCost: 0,
      adjustItemID: 0, sourceItemID: 0, amount: 0, totalAmount: 0, notes: '', rowStatus: 'I'
    };
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data: detail, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const selectProps = { search, setSearch, data: detail, setData: setDetail, newItem, siteId };
  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';

  return (
    <div className='po_back_invt3'>
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
export const List = withSizeHOC(Card);