import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { DynamicBSIcon, Table } from '../../../all';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';
import { EditableCell } from '../../../management/order/add/EditableCell';

export function TabTypeItems(props){
  const { bonusItems, setBonusItems, setError } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('bonus.bonus_point1')}</div>, accessor: 'bonusPoint', isQty: true,
        customStyle: { width: 145, paddingRight: 18 }, width: 125
      },
      {
        id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) => (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const newItem = invt => {
    setError && setError(null)
    return { invtId: invt.invtId, name: invt.name, bonusPoint: 0 };
  }

  const onClickDelete = row => {
    setBonusItems(bonusItems?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setBonusItems(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], bonusPoint: value };
      } else {
        return row;
      }
    }));
    setSearch({ value: null });
  }

  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data: bonusItems, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data: bonusItems, setData: setBonusItems, newItem };

  return (
    <div>
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight: '70vh'}}>
        <Table {...tableProps} />
      </div>
      <ItemSelect {...selectProps} />
    </div>
  );
}