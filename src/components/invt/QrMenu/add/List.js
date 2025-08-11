import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { withSize } from 'react-sizeme';
import {useTable,usePagination,useSortBy,useGlobalFilter,useResizeColumns,useRowSelect,useBlockLayout} from 'react-table';
import { useTranslation } from 'react-i18next';
import { TableResize } from '../../../all';
import { Search } from './Search';
// import { EditableCell as EditableCellQty } from './EditableCell';
import { ItemSelect } from './ItemSelect';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';
import { SelectableCell } from '../../inventory/add/EditableCell';
// import { status } from '../../../../helpers';

function Card({size,detail,setDetail,search,setSearch,siteId,setEdited,setDItems,editable,setSiteId}) 
{
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  const [types] = useState([
    { label: 'Идэвхтэй', value: 1 },
    { label: 'Идэвхгүй', value: 0 }
  ]);

  const updateMyData = (rowIndex, columnId, value) => {
    setDetail((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const rowStatus = row.rowStatus === 'I' ? 'I' : 'U';
          return {
            ...row,
            [columnId]: value,
            statusName: value === 1 ? 'Идэвхтэй' : 'Идэвхгүй',
            rowStatus,
          };
        }
        return row;
      })
    );
    setEdited && setEdited(true);
    setSearch({ value: null });
  };

  useEffect(() => {
    const cols = [
      {
        Header: t('inventory.title'),
        accessor: 'name',
        customStyle: { minWidth: 150 },
        width: 160,
        Cell: ({ row }) => <SelectItem item={row.original} />,
      },
      { Header: t('inventory.barcode'), accessor: 'barCode', width: 110 },
      {
        Header: <div style={{ textAlign: 'center' }}>{t('inventory.category')}</div>,
        accessor: 'categoryName',
        isText: !editable,
        width: 120,
      },
      {
            Header: <div style={{ textAlign: 'center' }}>{t('qrmenu.price')}</div>,
            accessor: 'price',
            Cell: ({ value }) => (
              <div style={{ textAlign: 'center' }}>
                {value != null ? `${value.toLocaleString()} ₮` : '0 ₮'}
              </div>
            ),
            width: 120,
            minWidth: 120,
            maxWidth: 120,
            isMoney: true
          },
      {
        Header: t('order.status'),
        accessor: 'status',
        isBtn: true,
        width: 120,
        minWidth: 90,
        Cell: props => <SelectableCell {...props} data={types} disabled={!editable} />
      },
    ];

    if (editable) {
      cols.push({
        id: 'delete',
        Header: '',
        width: 40,
        Cell: ({ row }) => (
          <div className="ac_delete_back">
            <i
              className="fa fa-trash ac_delete"
              onClick={() => onClickDelete(row)}
            />
          </div>
        ),
      });
    }

    setColumns(cols);
  }, [i18n?.language, editable]);


  const onClickDelete = (row) => {
    if (row.original?.rowStatus === 'U') {
      setDItems?.((prev) => [...prev, row.original]);
    }
    setDetail((prev) =>
      prev.filter((item) => item.invtId !== row.original.invtId)
    );
    setSearch({ value: null });
    setEdited && setEdited(true);
  };

  const newItem = (invt) => {
    const price = invt?.psSalesPrices?.[0]?.price || invt?.cost || invt?.price || 0;
    return {
      name: invt?.name ?? invt?.sku ?? '',
      invtId: invt?.invtId,
      barCode: invt?.barCode ?? invt?.barcode ?? '',
      categoryName: invt?.categoryName ?? invt?.category ?? '',
      qty: 1,
      price,
      status: 1,
      statusName: 'Идэвхтэй',
      rowStatus: 'I',
    };
  };

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150 }), []);
  const filterFunction = useCallback((rows, ids, query) =>
    rows.filter((row) =>
      row.values.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
      row.values.barCode?.includes(query)
    ), []);

  const tableInstance = useTable(
    {
      columns,
      data: detail,
      defaultColumn,
      globalFilter: filterFunction,
      updateMyData,
      autoResetPage: false,
      autoResetGlobalFilter: false,
      initialState: { pageIndex: 0, pageSize: 250000 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns
  );

  const searchProps = {
    handleEnter: tableInstance.setGlobalFilter,
    size,
    data: detail,
    setData: setDetail,
    siteId,
    setSiteId,
    check: false,
  };

  const maxHeight = 'calc(100vh - 250px)';

  return (
    <div className="po_back_invt3">
      <Search {...searchProps} />
      <div className="table_scroll" style={{ maxHeight, overflowY: 'auto' }}>
        <TableResize tableInstance={tableInstance} />
      </div>
      {editable && ( <ItemSelect search={search}setSearch={setSearch}data={detail}setData={(data) => { setDetail(data); setEdited && setEdited(true); }}newItem={newItem}siteId={siteId}/>

      )}
    </div>
  );
}

export const List = withSize()(Card);
