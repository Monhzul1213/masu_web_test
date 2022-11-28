import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Check, CheckBtn, PaginationTable, Table } from '../../all';

export function List(props){
  const { data, setData, onClickAdd, setShow, checked, setChecked, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => {
          return (<div style={style}><CheckBtn checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>)
        }
      },
      { Header: t('time.t_start'), accessor: 'begin' },
      { Header: t('time.t_end'), accessor: 'end' },
      { Header: t('time.t_emp'), accessor: 'empName' },
      { Header: t('time.t_site'), accessor: 'siteName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('time.t_total')}</div>, accessor: 'totalHours',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 870) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 49px - 10px - 37px)');
    else if(size?.width < 870 && size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 113px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 162px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onClickCheckAll = e => {
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
    setShow(!checked);
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

  const onRowClick = row => onClickAdd(row?.original);

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
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
  );
}