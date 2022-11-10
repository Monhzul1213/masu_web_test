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
      { Header: t('page.name'), accessor: 'variantName' },
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
  const { data, setData, onClickAdd, categories, setShow, checked, setChecked, updateInventory } = props;
  const [columns, setColumns] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, customStyle, Header: '',
        Cell: ({ row }) => !row?.original?.msInventoryVariants?.length ? '' :
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
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' :
          (<div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'msInventory.cost',
        customStyle: { width: 100 }, width: 80, isBtn: true,
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' : props?.row?.original?.msInventory?.isKit === 'Y'
          ? (<div style={{textAlign: 'right', paddingRight: 10}}>₮{formatNumber(props?.value)}</div>)
          : <EditableCell {...props} cellID='hide_border' />, isMoney: true,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.margin')}</div>, accessor: 'msInventory.margin', customStyle: { width: 90 },
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' :
          <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (row, column, value) => {
    let newData = {...data[row]?.msInventory, invtID: data[row]?.msInventory?.invtId, categoryID: data[row]?.msInventory?.categoryId, rowStatus: 'U' };
    newData.invvar = data[row]?.msInventoryVariants?.map(item => { return {...item, rowStatus: 'U'}});
    newData.invkite = data[row]?.msInvKitItems?.map(item => { return {...item, rowStatus: 'U'}});
    newData.invmod = data[row]?.msInventoryModifers?.map(item => { return {...item, rowStatus: 'U'}});
    newData.invsales = data[row]?.psSalesPrices?.map(item => { return {...item, rowStatus: 'U'}});
    if(column === 'msInventory.categoryId') newData.categoryID = value;
    else if(column === 'msInventory.cost') newData.cost = parseFloat(value ? value : 0);
    updateInventory(newData);
  }

  const onClickCheckAll = e => {
    setShow(!checked);
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    let count = false;
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) count = true;
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) count = true;
        return row;
      }
    }));
    setShow(count);
  }

  const onRowClick = row => onClickAdd(row?.original?.msInventory);
  
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck, updateMyData }, useSortBy, useExpanded, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick, Detail: ({ data }) => <Detail data={data} />, detailName: 'msInventoryVariants', colSpan: 7 };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 11px)';

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