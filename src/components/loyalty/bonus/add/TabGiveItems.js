import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { DynamicBSIcon, Table } from '../../../all';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';
import { EditableCell } from '../../../management/order/add/EditableCell';

export function TabGiveItems(props){
  const { rewardItems, setRewardItems, setError } = props;
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
        Header: <div style={{textAlign: 'right'}}>{t('bonus.earn_point')}</div>, accessor: 'earnPoint', isQty: true,
        customStyle: { width: 145, paddingRight: 18 }, width: 125
      },
      {
        id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) => row?.original?.rewardId ? (<div></div>) :
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const newItem = invt => {
    setError && setError(null)
    return { invtId: invt.invtId, name: invt.name, earnPoint: 0 };
  }

  const onClickDelete = row => {
    setRewardItems(rewardItems?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setRewardItems(old => old.map((row, index) => {
      if(index === rowIndex && old[rowIndex]?.rewardId){
        let edited = (old[rowIndex]?.edited ?? 0) + 1;
        return { ...old[rowIndex], edited };
      } else if(index === rowIndex){
        return { ...old[rowIndex], earnPoint: value };
      } else {
        return row;
      }
    }));
    setSearch({ value: null });
  }

  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data: rewardItems, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data: rewardItems, setData: setRewardItems, newItem };

  return (
    <div>
      <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight: '70vh'}}>
        <Table {...tableProps} />
      </div>
      <ItemSelect {...selectProps} />
    </div>
  );
}