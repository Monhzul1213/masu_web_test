import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

import { PaginationTable, Table } from '../../../all/all_m';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('coupon.name'), accessor: 'name', customStyle: { width: 150 } },
      { Header: t('coupon.type'), accessor: 'couponType', customStyle: { width: 50 } },
      { Header: t('coupon.couponAmt'), accessor: 'couponValue', customStyle: { width: 100 } },
      {
        Header: t('coupon.beginDate'), accessor: 'beginDate', customStyle: { width: 80 },
        Cell: ({ value }) => <div style={{}}>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>
      },
      {
        Header: t('coupon.endDate'), accessor: 'endDate', customStyle: { width: 80 },
        Cell: ({ value }) => <div style={{}}>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>
      },
      {
        Header: t('coupon.status'), accessor: 'status', customStyle: { width: 50 },
        Cell: ({ value, row }) => {
          let status = row?.original?.status;
          let color = status !== 1 ? 'var(--text-color)' : 'var(--text2-color)';
          return <span style={{ color }}>{value}</span>
        }
      },
      { Header: t('coupon.category'), accessor: 'categoryId', customStyle: { width: 80 } },
      { Header: t('coupon.invt'), accessor: 'invtId', customStyle: { width: 80 } },
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
    navigate({ pathname: 'coupon_add', search: createSearchParams({ couponId: row?.original?.couponId }).toString() });
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'transferNo', desc: true }] }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };


  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}