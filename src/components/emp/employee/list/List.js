 import React, { useState, useEffect } from 'react';
 import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Check, CheckBtn, PaginationTable, Table } from '../../../all';

export function List(props){
  const { data, setData, onClickAdd, setShow, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const { user: { mail } } = useSelector(state => state.login);

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => {
          let disabled = row?.original?.isOwner === 'Y' || row?.original?.email === mail;
          return (<div style={style}><CheckBtn checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} disabled={disabled} /></div>)
        }
      },
      { Header: t('page.name'), accessor: 'empName' },
      { Header: t('employee.mail'), accessor: 'email' },
      { Header: t('page.phone'), accessor: 'phone' },
      { Header: t('employee.role'), accessor: 'roleName' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);


  const onClickCheckAll = e => {
    let count = false;
    setData(old => old.map((row, index) => {
      let disabled = row?.isOwner === 'Y' || row?.email === mail;
      if(disabled) return row;
      else {
        if(!checked) count = true;
        return { ...old[index], checked: !checked };
      }
    }));
    setShow(count);
    setChecked(!checked);
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

  const onRowClick = row => onClickAdd(row?.original);
  
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 11px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  
  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}