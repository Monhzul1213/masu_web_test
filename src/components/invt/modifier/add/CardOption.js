import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { DynamicBSIcon, Input, PaginationTable, Table } from '../../../all';
import { EditableCell } from '../../inventory/add/EditableCell';

export function CardOption(props){
  const { name, setName, setError, data, setData, setDItems, setEdited, disabled, setDisabled, search, setSearch } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('page.name'), accessor: 'optionName',
        customStyle: { width: 430, paddingRight: 18 }, width: 410, length: 20
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'price', isMoney: true,// autoFocus: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
      },
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
    if(columnId === 'optionName'){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'optionName') hasError = true;
    }
    setDisabled(hasError);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], [columnId]: value, error: hasError ? columnId : null };
      } else if(hasError && errorIndex === index){
        return {...old[index], error: columnId };
      } else {
        return {...old[index], error: null };
      }
    }));
  }

  const onClickDelete = row => {
    if(row?.original?.rowStatus !== 'I') setDItems(old => [...old, row?.original]);
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
      setData(data?.filter((item, index) => row?.index !== index))
    }
    setSearch({ value: search?.value });
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let optionName = search?.value?.trim();
    if(optionName){
      let exists = data?.findIndex(d => d.optionName?.toLowerCase() === optionName?.toLowerCase());
      if(exists === -1){
        let item = { optionName, price: 0, rowStatus: 'I', modifireItemID: -1 };
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else setSearch({ value: search?.value?.trim(), error: t('modifier.option_error') });
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('modifier.name'), placeholder: t('modifier.name'), setError, inRow: true, setEdited, length: 20 };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 190px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false,
    initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete, disabled }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const addProps = { value: search, setValue: setSearch, placeholder: t('modifier.new'), handleEnter, inRow: true, length: 20 };

  return (
    <div className='ac_back' id='mo_ac_back'>
      <Input {...nameProps} />
      <div style={{padding: 7}} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <div style={{padding: 2}} />
      <Input {...addProps} />
      <div style={{padding: 5}} />
      <PaginationTable {...tableProps} />
    </div>
  )
}