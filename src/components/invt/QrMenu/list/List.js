import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
 
import { TableResize } from '../../../all';
 
export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
  setColumns([
    { Header: t('qrmenu.title'), accessor: 'descr', width: 150, minWidth: 80 },
    {
      Header: t('qrmenu.beginDate'), accessor: 'beginDate', width: 120, minWidth: 100,
      Cell: ({ value }) => <div>{moment(value).format('YYYY.MM.DD')}</div>
    },
    {
      Header: t('qrmenu.endDate'), accessor: 'endDate', width: 120, minWidth: 100,
      Cell: ({ value }) => <div>{moment(value).format('YYYY.MM.DD')}</div>
    },
    {
      Header: t('adjust.t_status'),
      accessor: 'status',
      width: 150,
      minWidth: 80,
      Cell: ({ value }) => (
        <div>
          {value === 1 ? 'Идэвхитэй' : 'Идэвхигүй'}
        </div>
      )
    },
    { Header: t('adjust.t_emp1'), accessor: 'createdUserName', width: 150, minWidth: 100 },
    {
      Header: t('adjust.t_created'), accessor: 'createdDate', width: 150, minWidth: 100,
      Cell: ({ value }) => <div>{moment(value).format('YYYY.MM.DD HH:mm')}</div>
    },
    {
      Header: <div style={{ textAlign: 'right' }}>{t('adjust.t_emp2')}</div>,
      accessor: 'lastUserName',
      width: 150,
      minWidth: 100,
    }
  ]);
}, [i18n?.language]);


 
  useEffect(() => {
    if(size?.width >= 830) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 60px)');
    else if(size?.width < 830 && size?.width >= 640) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px - 60px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);
 
  const onRowClick = row => {
    navigate({ pathname: 'qrmenuadd', search: createSearchParams({ qrMenuId: row?.original?.qrMenuId }).toString() });
  }
 
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 250000, sortBy: [{ id: 'qrMenuId', desc: true }] }},
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick };
 
 
  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
    </div>
  );
}