import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

import { TableResize, Money, PaginationTable } from '../../../../../components/all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('transfer.t_no'), accessor: 'transferNo', width: 130, minWidth: 80 },
      {
        Header: t('adjust.t_date'), accessor: 'txnDate', width: 120, minWidth: 100,
        Cell: ({ value }) => <div style={{}}>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>

      },
      { Header: t('transfer.from_site'), accessor: 'fromSiteName', width: 200, minWidth: 90 },
      { Header: t('transfer.to_site'), accessor: 'toSiteName', width: 200, minWidth: 90 },
      {
        Header: t('adjust.t_status'), accessor: 'statusName', width: 160, minWidth: 80,
        Cell: ({ value, row }) => {
          let status = row?.original?.status;
          let color = status !== 1 ? 'var(--text-color)' : 'var(--text2-color)';
          return <span style={{ color }}>{value}</span>
        }
      },
      { Header: t('adjust.t_emp'), accessor: 'txnEmpName', width: 140, minWidth: 100 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_total_qty')}</div>, accessor: 'totalQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 120, minWidth: 100,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_total_cost')}</div>, accessor: 'totalCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>, width: 150, minWidth: 140,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 830) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    else if(size?.width < 830 && size?.width >= 640) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 158px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = row => {
    navigate({ pathname: 'transfer_add', search: createSearchParams({ transferNo: row?.original?.transferNo }).toString() });
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'transferNo', desc: true }] }},
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick };


  return (
    <div>
      <div style={{overflow: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}