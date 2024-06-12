import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Table, PaginationTable, Input, DynamicBSIcon, DynamicAIIcon } from '../../../all';
import { EditableCell } from './EditableCell';

export function CardVariant(props){
  const { data, setData, setEdited, price, cost, search, setSearch, disabled, setDisabled, setDVariants } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('inventory.t_variant'), accessor: 'variantName', customStyle: { paddingRight: 18 }, width: null, length: 30 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'price', isMoney: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', isMoney: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
      },
      { Header: t('inventory.sku'), accessor: 'sku', customStyle: { width: 120, paddingRight: 18 }, width: 100, length: 30 },//, autoFocus: true
      { Header: t('inventory.barcode'), accessor: 'barCode', customStyle: { width: 120, paddingRight: 18 }, width: 100, length: 30 },
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
    if(columnId === 'variantName' || columnId === 'sku'){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'variantName') hasError = true;
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
    if(row?.original?.variantId || row?.original?.variantId === 0) setDVariants(old => [...old, row?.original]);
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
    let variantName = search?.value?.trim();
    if(variantName){
      let exists = data?.findIndex(d => d.variantName?.toLowerCase() === variantName?.toLowerCase());
      if(exists === -1){
        let item = { variantName, price: price?.value ?? 0, cost: cost?.value ?? 0, sku: '', barCode: '' };//InvtID, MerchantID
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
  const addProps = { value: search, setValue: setSearch, placeholder: t('inventory.add_variant'), handleEnter, inRow: true, length: 30 };

  return (
    <>
      <div className='ia_back'>
        <p className='ac_title'>{t('inventory.variant')}</p>
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <div style={{padding: 2}} />
        <Input {...addProps} />
        <div style={{padding: 5}} />
        <PaginationTable {...tableProps} />
      </div>
      <div  className='order_sub1'>
        <DynamicAIIcon name='AiOutlineInfoCircle' className='order_info'  />
        <p className='z_item_sub_title'>{t('orders.error1')}</p>
      </div>  
    </>
  );
}