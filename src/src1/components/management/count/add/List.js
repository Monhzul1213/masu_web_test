import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Search } from './Search';
import { ItemSelect } from './SelectItem';
import { SelectItem } from '../../../../../components/invt/inventory/add/SelectItem';
import { EditableCell, SelectableCell, EditableCellQty } from './EditableCell';
import { TableResize, DynamicBSIcon } from '../../../../../components/all';
import { add } from '../../../../../helpers';
import { Money } from '../../../all/all_m';

function Card(props){
  const { size, detail, setDetail, search, setSearch, siteId, setEdited, setDItems, editable, setSiteId, status } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [types] = useState(t('count.status1'));
  const disabled = status?.value === 0 ? true : false;

  useEffect(() => {
    let columns = [
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 150 }, width: 380, minWidth: 200,
        Cell: ({ row }) => (<SelectItem item={row?.original} />), exLabel: t('inventory.title'), exLabel1: t('inventory.title')
      }, 
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 110, minWidth: 90, exLabel: t('inventory.barcode'), exLabel1: t('inventory.barcode')}, 
      {
        Header: t('pos.t_status'), accessor: 'itemStatus', isBtn: true, width: 150, minWidth: 90, exLabel: t('pos.t_status'),
        Cell: props => <SelectableCell {...props} data={types} disabled={disabled || !editable }/>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countQty')}</div>, accessor: 'countQty', width: 100, minWidth: 90, exLabel: t('count.countQty'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countedQty')}</div>, accessor: 'countedQty', exLabel: t('count.countedQty'), exLabel1: 'Тоолсон_тоо',//isText: !header ? true : false,
        Cell: props => <EditableCellQty {...props} disabled= {disabled || !editable}/>, width: 130, minWidth: 130, maxWidth: 130
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varQty')}</div>, accessor: 'varianceQty', width: 130, minWidth: 130,         
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, exLabel: t('count.varQty'),
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.descr1')}</div>, accessor: 'notes', width: 120, minWidth: 120, exLabel: t('inventory.descr1'),
        Cell: props => <EditableCell {...props}  disabled={disabled || !editable} />, //isText: !header ? true : false, 
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', width: 150, minWidth: 80, exLabel: t('inventory.total_cost'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.total_cost')}</div>, accessor: 'totalCost', width: 150, minWidth: 80, exLabel: t('inventory.total_cost'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varCost')}</div>, accessor: 'totalVarianceCost', width: 150, minWidth: 80, exLabel: t('count.varCost'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'amount', width: 150, minWidth: 80, exLabel: t('order.total'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.total')}</div>, accessor: 'totalAmount', width: 150, minWidth: 80, exLabel: t('order.total'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varAmt')}</div>, accessor: 'totalVarianceAmount', width: 150, minWidth: 80, exLabel: t('count.varAmt'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>,
      },
    ];
    if(editable)
      columns.push({
        id: 'delete', noSort: true, Header: '', width: 40, minWidth: 40, maxWidth: 40,
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      });
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, editable, disabled]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setDetail(old => old.map((row, index) => {
      if(index === rowIndex){
        let countedQty = columnId === 'countedQty' ? parseFloat(value ? value : 0) : old[rowIndex]?.countedQty;
        let itemStatus = columnId === 'itemStatus' ? value : countedQty > 0 ? 1 : old[rowIndex]?.itemStatus;
        let notes = columnId === 'descr' ? value : old[rowIndex]?.notes;
        let varianceQty = add(countedQty, old[rowIndex]?.countQty, true);
        return { ...old[rowIndex], itemStatus, countedQty, varianceQty, notes };
      } else { 
        return row;
      }
    }));
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.countItemID !== 0) setDItems(old => [...old, row?.original]);
    setDetail(detail?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const newItem = (invt) => {
    return {
      name: invt?.name, invtId: invt?.invtId, invtID: invt?.invtId, barCode: invt?.barCode,
      itemType: 0, siteQty: invt?.siteQty, qty: 0, cost: invt?.cost, countQty: invt?.siteQty,
      picountItemId: 0, notes: '', rowStatus: 'I', itemStatus: 0, countedQty: invt?.countedQty
    };
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data: detail, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 100000 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const { setGlobalFilter } = tableInstance;
  const searchProps = { handleEnter: setGlobalFilter, size, data: detail, setData: setDetail, siteId, setSiteId, status, columns};
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const selectProps = { search, setSearch, data: detail, setData: setDetail, newItem, siteId, setSiteId, status };

  return (
    <div className='po_back_invt3'>
      <Search {...searchProps} />
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <TableResize {...tableProps} />
      </div>
      {editable && <ItemSelect {...selectProps} />}
      <div />
    </div>
  );
}

const withSizeHOC = withSize();
export const List = withSizeHOC(Card);