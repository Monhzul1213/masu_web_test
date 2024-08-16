import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Money, TableResize } from '../../../../../components/all';
import { Search } from '../../../../../components/management/order/add/Search';
import { ItemSelect } from './SelectItem';

function Card(props){
  const { size, detail, setDetail, search, setSearch, siteId, setEdited, setDItems, editable } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let columns = [
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 }, width: 200, minWidth: 90,
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 120, minWidth: 90 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty3')}</div>, accessor: 'lQty', isText: !editable, width: 130, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty1')}</div>, accessor: 'qty', isText: !editable, width: 130, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'handQty', width: 120, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', width: 130, minWidth: 80, editable,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={15} /></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total')}</div>, accessor: 'totalCost', width: 150, minWidth: 120,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={15} /></div>,
      },
    ];
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setDetail(old => old.map((row, index) => {
      if(index === rowIndex){
         return { ...old[rowIndex]};
      } else {
        return row;
      }
    }));
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.adjustItemID !== 0) setDItems(old => [...old, row?.original]);
    setDetail(detail?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const newItem = invt => {
    return {
      name: invt.name, invtId: invt.invtId, invtID: invt.invtId, sku: invt?.sku, barCode: invt?.barCode, allowDecimal: invt?.isEach === 'N',
      itemType: 'RC', siteQty: invt?.siteQty, qty: 0, cost: invt.cost, origCost: invt.cost, leftQty: invt?.siteQty, totalCost: 0, totalQty: invt?.totalQty,
      adjustItemID: 0, sourceItemID: 0, amount: 0, totalAmount: 0, notes: '', rowStatus: 'I',
    };
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data: detail, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 250000 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const selectProps = { search, setSearch, data: detail, setData: setDetail, newItem, siteId };

  return (
    <div className='po_back_invt3'>
      <Search {...searchProps} />
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <TableResize {...tableProps} />
      </div>
      {editable && <ItemSelect {...selectProps} />}
    </div>
  );
}

const withSizeHOC = withSize();
export const List = withSizeHOC(Card);