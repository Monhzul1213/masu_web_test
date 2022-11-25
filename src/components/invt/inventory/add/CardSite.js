import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, CheckAll, PaginationTable, Table } from '../../../all';
import { EditableCell } from './EditableCell';

export function CardSite(props){
  const { isTrack, data, setData, setEdited, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 72 };
    let columns = [
      {
        id: 'check', noSort: true, isBtn: true, customStyle: { width: 75 },
        Header: <div style={style}>{t('inventory.t_choose')}</div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: <div style={{flex: 1}}>{t('inventory.t_site')}</div>, accessor: 'name', isText: true },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_price')}</div>, accessor: 'price', noSort: true, isMoney: true,
        customStyle: { width: 100 }, width: 100 },
    ];
    if(isTrack){
      columns.push({ Header: t('inventory.t_stock'), accessor: 'stock', noSort: true, isQty: true, width: 90 });
      columns.push({ Header: t('inventory.t_track'), accessor: 'track', noSort: true, isQty: true, width: 90 });
    }
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, isTrack]);

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

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'price') return { ...old[rowIndex], [columnId]: value, changed: true };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row
    }));
    setEdited && setEdited(true);
  }
 
  const defaultColumn = { Cell: EditableCell };
  const checkProps = { type: 'inventory', checked, onCheckAll, style: {border: 'none'} };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';

  return (
    <div className='ia_back'>
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll {...checkProps} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}