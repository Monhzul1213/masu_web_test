import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';

import { add } from '../../../../../helpers';
import { DynamicBSIcon, IconButton, PaginationTable } from '../../../all/all_m';
import { Search } from '../../../../../components/management/order/add/Search';
import { ItemSelect } from './SelectItem';
import { SelectItem } from '../../../../../components/invt/inventory/add/SelectItem';
import { EditableCell as EditableCellQty } from './EditableCell';
import { TableResize } from '../../../../../components/all';
import { Order } from '../order/Order';

function Card(props){
  const { size, detail, setDetail, search, setSearch, fromSiteId, toSiteId, setEdited, setDItems, editable, setToSiteId } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let columns = [
      {
        Header: t('inventory.title'), accessor: 'name', customStyle: { minWidth: 200 }, width: 200, minWidth: 90,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      }, 
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 140, minWidth: 90 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'siteQty', width: 120, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_qty1')}</div>, accessor: 'qty', isText: !editable,
        Cell: props => <EditableCellQty {...props} />, width: 130, minWidth: 130, maxWidth: 130,
      },  
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_left')}</div>, accessor: 'leftQty', width: 180, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>,
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
  }, [i18n?.language, editable]);

  const filterFunction = useCallback((rows, ids, query) => {
    return rows.filter(row => row.values['name']?.toLowerCase()?.includes(query?.toLowerCase()) || row.values['barCode']?.includes(query));
  }, []);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setDetail(old => old.map((row, index, a) => {
      if(index === rowIndex){
        let qty = columnId === 'qty' ? parseFloat(value ? value : 0) : old[rowIndex]?.qty;
        let leftQty = add(old[rowIndex]?.siteQty, qty, a );
        return { ...old[rowIndex], qty, leftQty };
      } else {
        return row;
      }
    }));
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.transferItemId !== 0) setDItems(old => [...old, row?.original]);
    setDetail(detail?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const onClick = (e) => {
    e?.preventDefault();
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  const newItem = invt => {
    return {
      name: invt.name, invtId: invt.invtId, sku: invt?.sku, barCode: invt?.barCode,
      siteQty: invt?.siteQty, qty: 0, cost: invt.cost, leftQty: invt?.siteQty, totalCost: 0,
      notes: '', rowStatus: 'I',
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
  const selectProps = { search, setSearch, data: detail, setData: setDetail, newItem, fromSiteId, toSiteId };
  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const addProps = { className: 'po_add_btn', text: t('transfer.order_invt'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick};
  const modalProps = { visible, closeModal, item: detail , setItem: setDetail, setVisible, toSiteId, setToSiteId};

  return (
    <div className='po_back_invt3'>
      {visible && <Order {...modalProps}/>}
      <Search {...searchProps} />
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
        <TableResize {...tableProps} />
      </div>
      {editable && <ItemSelect {...selectProps} />}
      <div className={classPage}>
        <PaginationTable {...tableProps} />
        <IconButton {...addProps}/>
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const List = withSizeHOC(Card);