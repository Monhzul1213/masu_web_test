import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { Check, DynamicFAIcon, PaginationTable, Table, TableDetail, TableRow } from '../../../all';
import { EditableCell, SelectableCell } from '../add/EditableCell';

function Detail(props){
  const { data } = props;
  const [columns, setColumns] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const customStyle = { width: 40 };
    setColumns([
      { id: 'expander', noSort: true, customStyle, Header: '', Cell: '' },
      { id: 'check', noSort: true, customStyle, Header: '', Cell: '' },
      { Header: t('page.name'), accessor: 'name' },
      { id: 'category', noSort: true, Header: '', Cell: '', customStyle: { width: 240 } },
      {
        Header: t('inventory.price'), accessor: 'price', customStyle: { width: 100 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>
      },
      {
        Header: t('inventory.cost'), accessor: 'cost', customStyle: { width: 100 }, width: 80, isBtn: true,
        Cell: props => <EditableCell {...props} cellID='hide_border' />, isMoney: true
      },
      {
        Header: t('inventory.margin'), accessor: 'margin', customStyle: { width: 90 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onRowClick = row => {
    console.log(row?.original);
  }

  const updateMyData = (row, column, value) => {
    console.log(row, column, value);
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, updateMyData }, useSortBy, useRowSelect);
  const tableProps = { tableInstance, onRowClick, noHeader: true };
  const maxHeight = 'calc(70vh)';

  return (
    <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
      <TableRow {...tableProps} />
    </div>
  )
}

export function List(props){
  const { data, onClickAdd, categories } = props;
  const [columns, setColumns] = useState([]);
  const [checked, setChecked] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, customStyle, Header: '',
        Cell: ({ row }) => !row?.original?.variants?.length ? '' :
          (<div style={style}>
            <DynamicFAIcon {...row.getToggleRowExpandedProps()} name={row.isExpanded ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' />
          </div>)
      },
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      {
        Header: t('page.name'), accessor: 'msInventory.name',
      },
      {
        Header: t('category.title'), accessor: 'msInventory.categoryId', customStyle: { width: 240 }, width: 220, isBtn: true,
        Cell: props => <SelectableCell {...props} data={categories} s_value='categoryId' s_descr='categoryName' />
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'msInventory.price', customStyle: { width: 100 },
        Cell: props => props?.row?.original?.variants?.length ? '' :
          (<div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'msInventory.cost',
        customStyle: { width: 100 }, width: 80, isBtn: true,
        Cell: props => props?.row?.original?.variants?.length ? '' : props?.row?.original?.isKit
          ? (<div style={{textAlign: 'right', paddingRight: 10}}>₮{formatNumber(props?.value)}</div>)
          : <EditableCell {...props} cellID='hide_border' />, isMoney: true,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.margin')}</div>, accessor: 'msInventory.margin', customStyle: { width: 90 },
        Cell: props => props?.row?.original?.variants?.length ? '' :
          <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (row, column, value) => {
    console.log(row, column, value);
  }

  const onClickCheckAll = e => {

  }

  const onClickCheck = e => {

  }

  const onRowClick = row => {
    console.log(row?.original);
    //onClickAdd
  }
  
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck, updateMyData }, useSortBy, useExpanded, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick, Detail: ({ data }) => <Detail data={data} />, detailName: 'variants', colSpan: 7 };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableDetail {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}