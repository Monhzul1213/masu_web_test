import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon } from '../../../all';
import { EditableCell } from '../../../invt/inventory/add/EditableCell';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';
import { formatNumber } from '../../../../helpers';

function Card(props){
  const { valid, setValid, items, setItems, dItems, setDItems, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState({ value: null });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'siteQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_incoming')}</div>, accessor: 'transitQty', isText: true,
        customStyle: { width: 100, paddingRight: 18, textAlign: 'right' }, width: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', isQty: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80 },//, autoFocus: true
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', isMoney: true,
        customStyle: { width: 120, paddingRight: 18 }, width: 100 },//, autoFocus: true
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_total')}</div>, accessor: 'totalCost', isText: true, customStyle: { width: 100 },
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}>₮{formatNumber(value)}</div>,
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
    // e?.preventDefault();
    // let total = 0;
    // setData(old => old.map((row, index) => {
    //   if(index === rowIndex){
    //     let cost = old[rowIndex]?.unitCost * parseFloat(value ? value : 0);
    //     total += cost;
    //     return { ...old[rowIndex], [columnId]: value, cost };
    //   } else {
    //     total += row.cost;
    //     return row;
    //   }
    // }));
    // setTotal(total);
    // setCost({ value: total });
    // setEdited && setEdited(true);
    // setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.orderItemId || row?.original?.orderItemId === 0) setDItems(old => [...old, row?.original]);
    let newTotal = total - (row?.original?.totalCost ?? 0);
    setTotal(newTotal);
    setItems(items?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }
  
  const newItem = invt => {
    //invtCode
    return { invtId: invt.invtId, name: invt.name, orderQty: 0, totalCost: 0, cost: invt.cost, siteQty: 0, transitQty: 0 };
  }

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';

  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data: items, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data: items, setData: setItems, newItem };

  return (
    <div className='po_back'>
      <p className='ac_title'>{t('inventory.title')}</p>
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