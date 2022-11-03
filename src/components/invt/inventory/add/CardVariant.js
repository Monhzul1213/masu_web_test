import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Table, PaginationTable, Input, DynamicBSIcon } from '../../../all';
import { EditableCell } from './EditableCell';

export function CardVariant(props){
  const { data, setData, setEdited, price, cost } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState({ value: '' });

  useEffect(() => {
    setColumns([
      { Header: t('inventory.t_variant'), accessor: 'VariantName' },
      { Header: t('inventory.price'), accessor: 'Price' },
      { Header: t('inventory.cost'), accessor: 'Cost' },
      { Header: t('inventory.sku'), accessor: 'Sku' },
      { Header: t('inventory.barcode'), accessor: 'Barcode' },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
      // {
      //   Header: t('inventory.t_comp'), accessor: 'name',
      //   Cell: ({ row }) => (<SelectItem item={row?.original} />)
      // },
      // { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', isQty: true,
      //   customStyle: { width: 100, paddingRight: 18 }, width: 80, autoFocus: true },
      // {
      //   Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', disabled: true, customStyle: { width: 100 },
      //   Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}>{formatNumber(value)}</div>,
      // },
      // 
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value) => {
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
  }

  const onClickDelete = row => {
    setData(data?.filter(item => item?.VariantName !== row?.original?.VariantName));
  }

  const handleEnter = () => {
    let VariantName = search?.value?.trim();
    let exists = data?.findIndex(d => d.VariantName?.toLowerCase() === VariantName?.toLowerCase());
    if(exists === -1){
      let item = { VariantName, Price: price?.value ?? 0, Cost: cost?.value ?? 0, Sku: '', Barcode: '' };//InvtID, MerchantID
      setData(old => [...old, item]);
      setSearch({ value: '' });
      setEdited && setEdited(true);
    } else setSearch({ value: search?.value?.trim(), error: t('inventory.variant_error') });
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const addProps = { value: search, setValue: setSearch, placeholder: t('inventory.add_variant'), handleEnter, inRow: true };

  return (
    <div className='ac_back'>
      <p className='ac_title'>{t('inventory.variant')}</p>
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <div style={{padding: 2}} />
      <Input {...addProps} />
      <div style={{padding: 5}} />
      <PaginationTable {...tableProps} />
    </div>
  );
}