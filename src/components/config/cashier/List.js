import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Check, CheckBtn, PaginationTable, Table } from '../../all';

export function List(props){
  const { data, setData, setShow, checked, setChecked, onClickAdd } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center' };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => {
          let disabled = row?.original?.isDefault === 'Y';
          let cellProps = { checked: row?.original?.checked, onClick: e => onClickCheck(e, row), disabled };
          return (<div style={style}><CheckBtn {...cellProps} /></div>)
        }
      },
      { Header: t('pos.t_name'), accessor: 'paymentTypeName' },
      { Header: t('cashier.category'), accessor: 'detailName' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = () => {
    let count = false;
    setData(old => old.map((row, index) => {
      let disabled = row?.isDefault === 'Y';
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

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  
  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}