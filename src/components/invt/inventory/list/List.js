import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { Check, DynamicFAIcon, PaginationTable, TableDetail } from '../../../all';
import { EditableCell, SelectableCell } from '../add/EditableCell';
import { Detail } from './Detail';

export function List(props){
  const { data, setData, onClickAdd, categories, setShow, checked, setChecked, updateInventory, autoResetExpanded } = props;
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

  const updateMyData = async (row, column, value, e, invvar, isEdit, isExpand) => {
    let item = data[row]?.msInventory;
    let newData = { invtID: item?.invtId, categoryID: item?.categoryId, cost: item?.cost };
    if(column === 'msInventory.categoryId') newData.categoryID = value;
    else if(column === 'msInventory.cost') newData.cost = parseFloat(value ? value : 0);
    else if(invvar) newData.invvar = invvar;
    const response = await updateInventory(newData, isEdit, isExpand);
    return response;
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
    setShow(false);
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) setShow(true);
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) setShow(true);
        return row;
      }
    }));
  }

  const onRowClick = row => onClickAdd(row?.original?.msInventory);
  
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, autoResetExpanded,
    initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck, updateMyData }, useSortBy, useExpanded, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick, Detail: props => <Detail {...props} updateData={updateMyData} />,
    detailName: 'msInventoryVariants', colSpan: 7 };
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