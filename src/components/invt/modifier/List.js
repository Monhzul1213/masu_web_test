import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Check, PaginationTable, Table } from '../../all';
import { SelectItem } from '../inventory/add/SelectItem';

export function List(props){
  const { data, setData, setShow, checked, setChecked } = props;
  const [columns, setColumns] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      {
        Header: t('page.name'), accessor: 'modifer.modiferName',
        Cell: ({ row }) =>
          (<SelectItem item={{name: row?.original?.modifer?.modiferName, sku: row?.original?.modifer?.options}} label='' />)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = () => {
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

  const onRowClick = row => {
    navigate({ pathname: 'modi_add', search: createSearchParams({ modifireID: row?.original?.modifer?.modifireID }).toString() });
  }

  
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  
  return (
    <div>
      <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}