import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';

import {  DynamicBSIcon, Table } from '../../../../../components/all';
import { add } from '../../../../../helpers';
import { ItemSelect } from '../../../../../components/invt/inventory/add/SelectItem';

function Card(props){
  const { detail, setDetail, search, setSearch, siteId, setEdited, editable, setSiteId, status } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const disabled = status?.value === 0 ? true : false;

  
  useEffect(() => {
    let columns = [
      {
        Header: t('page.name'), accessor: 'name', exLabel: t('page.name') 
      },
      {
        Header: t('inventory.barcode'), accessor: 'barCode', exLabel: t('inventory.barcode') 
      },
      {
        Header: t('category.title'), accessor: 'categoryName', customStyle: { width: 240 }, width: 220, isBtn: true, exLabel: t('category.title'),
      },
    ];
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
  if (row?.original?.invtId != null) {
    setDetail(old => {
      const updated = old.map(item =>
        item.invtId === row.original.invtId
          ? { ...item, isdelete: 1, rowStatus: 'U', status: 0 }
          : { ...item, status: 1 }
      );
      return updated;
    });
  } else {
    const filtered = detail?.filter(item => item?.invtId !== row?.original?.invtId);
    setDetail(filtered);
  }
  setSearch({ value: null });
  setEdited && setEdited(true);
}

  const newItem = (invt) => {
    return {
      name: invt?.name, invtId: invt?.invtId, invtID: invt?.invtId, barCode: invt?.barCode,
     siteQty: invt?.siteQty, qty: 0, countQty: invt?.siteQty,
     rowStatus: 'I', itemStatus: 0, countedQty: invt?.countedQty, categoryName: invt?.categoryName, status: 1
    };
  }
  const filteredDetail = useMemo(
  () => detail.filter(item =>
    (item.status === 1 || item.status === undefined) && (item.isdelete !== 1 && item.isdelete !== "1")
  ),
  [detail]
);
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data: filteredDetail, defaultColumn, autoResetPage: false, autoResetGlobalFilter: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 100000 }, globalFilter: filterFunction, updateMyData, onClickDelete },
    useGlobalFilter, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const selectProps = { search, setSearch, data: detail, setData: setDetail, newItem, siteId, setSiteId, status };

  return (
    <div className='po_back_invt3'>
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      { <ItemSelect {...selectProps} />}
      <div />
    </div>
  );
}

const withSizeHOC = withSize();
export const InvtList = withSizeHOC(Card);