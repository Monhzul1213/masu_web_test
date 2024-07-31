import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

import { Money, PaginationTable } from '../../../all/all_m';
import { TableResize } from '../../../../../components/all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('count.t_no'), accessor: 'picountNo', width: 110, minWidth: 80 },
      {
        Header: t('adjust.t_date'), accessor: 'txnDate', width: 120, minWidth: 100,
        Cell: ({ value }) => <div style={{}}>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>

      },
      { Header: t('count.emp'), accessor: 'txnEmpName', width: 120, minWidth: 90 },
      { Header: t('count.site'), accessor: 'siteName', width: 120, minWidth: 90 },
      {
        Header: t('adjust.t_status'), accessor: 'statusName', width: 130, minWidth: 80,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countQty')}</div>, accessor: 'totalCountQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 120, minWidth: 100,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countedQty')}</div>, accessor: 'totalCountedQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varQty')}</div>, accessor: 'totalVarianceQty',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_total_cost')}</div>, accessor: 'totalCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.total_amount')}</div>, accessor: 'totalAmount',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varCost')}</div>, accessor: 'totalVarianceCost',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varAmt')}</div>, accessor: 'totalVarianceAmount',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      { Header: t('order.note'), accessor: 'descr', width: 120, minWidth: 90 }
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
    navigate({ pathname: 'count_add', search: createSearchParams({ piCountNo: row?.original?.picountNo }).toString() });
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'transferNo', desc: true }] }},
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick };


  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}