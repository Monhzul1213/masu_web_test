import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

import { TableResize, Money, PaginationTable, Empty1 } from '../../../../../components/all';
import { Filter } from './Filter';

export function List(props){
  const { data, size, setData, onClickAdd, onClickDelete, show, setError, onSearch } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('count.t_no'), accessor: 'picountNo', width: 110, minWidth: 80, exLabel: t('count.t_no') },
      {
        Header: t('adjust.t_date'), accessor: 'txnDate', width: 120, minWidth: 100, exLabel: t('adjust.t_date'),
        Cell: ({ value }) => <div style={{}}>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>
      },
      { Header: t('count.emp'), accessor: 'txnEmpName', width: 120, minWidth: 90, exLabel: t('count.emp') },
      { Header: t('count.site'), accessor: 'siteName', width: 120, minWidth: 90, exLabel: t('count.site')},
      { Header: t('adjust.t_status'), accessor: 'statusName', width: 130, minWidth: 80, exLabel: t('adjust.t_status') },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countQty')}</div>, accessor: 'totalCountQty', exLabel: t('count.countQty'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 120, minWidth: 100,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.countedQty')}</div>, accessor: 'totalCountedQty', exLabel: t('count.countedQty'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varQty')}</div>, accessor: 'totalVarianceQty', exLabel: t('count.varQty'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('adjust.t_total_cost')}</div>, accessor: 'totalCost', exLabel: t('adjust.t_total_cost'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.total_amount')}</div>, accessor: 'totalAmount', exLabel: t('count.total_amount'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varCost')}</div>, accessor: 'totalVarianceCost', exLabel: t('count.varCost') ,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('count.varAmt')}</div>, accessor: 'totalVarianceAmount', exLabel: t('count.varAmt'),
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={value}/></div>, width: 150, minWidth: 140,
      },
      { Header: t('order.note'), accessor: 'descr', width: 120, minWidth: 90, exLabel: t('order.note') }
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
  const filterProps = { columns, data, setData, size, onClickAdd, onClickDelete, show, setError, onSearch };

  return (
    <div>
      <Filter {...filterProps} />
      {!data?.length ? <Empty1 icon='MdOutlineArticle' /> :
      <div style={{overflow: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>    
        <PaginationTable {...tableProps} />
      </div>}
    </div>
  );
}