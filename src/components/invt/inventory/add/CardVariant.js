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
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setColumns([
      { Header: t('inventory.t_variant'), accessor: 'VariantName', customStyle: { paddingRight: 18 }, width: null },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'Price', isMoney: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'Cost', isMoney: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
      },
      { Header: t('inventory.sku'), accessor: 'Sku', customStyle: { width: 120, paddingRight: 18 }, width: 100 },//, autoFocus: true
      { Header: t('inventory.barcode'), accessor: 'Barcode', customStyle: { width: 120, paddingRight: 18 }, width: 100 },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'>
            <DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} />
          </div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let hasError = false, errorIndex = -1;
    if(columnId === 'VariantName' || columnId === 'Sku'){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'VariantName') hasError = true;
    }
    setDisabled(hasError);
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], [columnId]: value, error: hasError ? columnId : null };
      } else if(hasError && errorIndex === index){
        return {...old[index], error: columnId };
      } else {
        return {...old[index], error: null };
      }
    }));
    setEdited && setEdited(true);
  }

  const onClickDelete = row => {
    if(row?.original?.error){
      setDisabled(false);
      setData(old => old?.reduce(function(list, item, index) {
        if(index !== row?.index){
          item.error = null;
          list.push(item);
        }
        return list;
      }, []));
    } else {
      setData(data?.filter((item, index) => row?.index !== index));
    }
    setSearch({ value: search?.value });
  }

  const handleEnter = e => {
    e?.preventDefault();
    let VariantName = search?.value?.trim();
    if(VariantName){
      let exists = data?.findIndex(d => d.VariantName?.toLowerCase() === VariantName?.toLowerCase());
      if(exists === -1){
        let item = { VariantName, Price: price?.value ?? 0, Cost: cost?.value ?? 0, Sku: '', Barcode: '' };//InvtID, MerchantID
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else setSearch({ value: search?.value?.trim(), error: t('inventory.variant_error') });
    }
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete, disabled }, useSortBy, usePagination, useRowSelect);
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