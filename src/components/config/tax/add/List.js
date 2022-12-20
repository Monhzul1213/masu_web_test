import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Table, PaginationTable, IconButton, DynamicMDIcon } from '../../../all';

export function List(props){
  const { data } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let columns = [
      { Header: t('inventory.t_site'), accessor: 'name' },
      { Header: t('tax.location'), accessor: 'descr' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'posQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      {
        Header: t('tax.coordinate'), accessor: 'coordinate',
        Cell: ({ value, onPressCoordinate }) => (<IconButton className='co_coord_btn' text={value} icon={<DynamicMDIcon name='MdLocationPin'
          className='co_coord_icon' />} onClick={onPressCoordinate} />)
      }
    ];
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    // setData(old => old.map((row, index) => {
    //   if(index === rowIndex){
    //     if(columnId === 'price') return { ...old[rowIndex], [columnId]: value, changed: true };
    //     return { ...old[rowIndex], [columnId]: value };
    //   }
    //   return row
    // }));
    // setEdited && setEdited(true);
  }

  const onPressCoordinate = () => {

  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onPressCoordinate }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  
  return (
    <div className='add_back' style={{paddingTop: 0}}>
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}
/*

import { Check, CheckAll, PaginationTable, Table } from '../../../all';
import { EditableCell } from './EditableCell';

export function CardSite(props){
  const { isTrack, data, setData, setEdited, checked, setChecked } = props;

 

  const onCheckAll = checked => {
    setChecked(checked);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row
    }));
  }

  
 
  const defaultColumn = { Cell: EditableCell };
  const checkProps = { type: 'inventory', checked, onCheckAll, style: {border: 'none'} };
  

  return (
    <div className='ia_back'>
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll {...checkProps} />
      
    </div>
  );
}
*/