import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Check, DynamicFAIcon, PaginationTable, Table, TableDetail, TableRow } from '../../../all';

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
      { id: 'category', noSort: true, Header: '', Cell: '', customStyle: { width: 210 } },
      {
        Header: t('inventory.price'), accessor: 'price', customStyle: { width: 100 }
      },
      {
        Header: t('inventory.cost'), accessor: 'cost', customStyle: { width: 100 }
      },
      {
        Header: t('inventory.margin'), accessor: 'margin', customStyle: { width: 90 }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onRowClick = row => {
    console.log(row?.original);
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false}, useSortBy, useRowSelect);
  const tableProps = { tableInstance, onRowClick, noHeader: true };
  const maxHeight = 'calc(70vh)';

  return (
    <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
      <TableRow {...tableProps} />
    </div>
  )
}

export function List(props){
  const { data, onClickAdd } = props;
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
        Header: t('page.name'), accessor: 'name',
      },
      {
        Header: t('category.title'), accessor: 'category', customStyle: { width: 210 }
      },
      {
        Header: t('inventory.price'), accessor: 'price', customStyle: { width: 100 }
      },
      {
        Header: t('inventory.cost'), accessor: 'cost', customStyle: { width: 100 }
      },
      {
        Header: t('inventory.margin'), accessor: 'margin', customStyle: { width: 90 }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = e => {

  }

  const onClickCheck = e => {

  }
  
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, useExpanded, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd, Detail: ({ data }) => <Detail data={data} />, detailName: 'variants', colSpan: 7 };
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