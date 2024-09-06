import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { TableResize, Money, PaginationTable } from '../../../../../components/all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState('300px');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('coupon.name'), accessor: 'name', width: 220, minWidth: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('coupon.couponAmt')}</div>, accessor: 'couponValue', width: 130, minWidth: 70,
      Cell: props => props?.row?.original?.couponType === 1 ? 
        <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> 
        : <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}%</div>      
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', width: 80, minWidth: 50,
      Cell: props =>  <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div> 
      },
      {Header: t('page.date'), accessor: 'date', width: 200, minWidth: 100},
      { Header: t('coupon.status'), accessor: 'statusName', width: 120, minWidth: 60 },
      { Header: t('coupon.category'), accessor: 'categoryName', width: 180, minWidth: 100 },
      { Header: t('coupon.invt'), accessor: 'invtName', width: 270, minWidth: 100 },
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