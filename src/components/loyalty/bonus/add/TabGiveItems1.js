import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { DynamicBSIcon, Table } from '../../../all';
import { SelectableCell, EditableCell } from '../../../invt/inventory/add/EditableCell';
import { ItemSelect, SelectItem } from '../../../invt/inventory/add/SelectItem';

export function TabGiveItems1(props){
  const { rewardItems, setRewardItems, setError } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState('');
  const [types] = useState([{ value: 0, label: t('discount.perc') }, { value: 1, label: t('discount.amount') }]);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.title'), accessor: 'name',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      {
        Header: t('bonus.discount_type'), accessor: 'discountType', customStyle: { width: 110 }, width: 90, isBtn: true,
        Cell: props => <SelectableCell {...props} data={types} />
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('bonus.discount_value')}</div>, accessor: 'discountValue', isQty: true,
        customStyle: { width: 145, paddingRight: 18 }, width: 125
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('bonus.earn_point')}</div>, accessor: 'earnPoint', isQty: true,
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
    return { invtId: invt.invtId, name: invt.name, earnPoint: 0, discountType: 0, discountValue: 0 };
  }

  const onClickDelete = row => {
    setRewardItems(rewardItems?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setRewardItems(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'discountValue'){
          let discountValue = value;
          let edited = old[rowIndex]?.edited ?? 0;
          if(old[rowIndex]?.discountType === 0){
            discountValue = parseFloat(discountValue) > 100 ? '100' : value;
          }
          return { ...old[rowIndex], discountValue, edited: edited + 1 };
        }
        else if(columnId !== 'discountType') return { ...old[rowIndex], [columnId]: value };
        else return { ...old[rowIndex], [columnId]: value, discountValue: 0, isMoney1: value === 1 };
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