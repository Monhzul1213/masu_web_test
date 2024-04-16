import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';

import { PaginationTable, TableResize } from '../../../all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const navigate = useNavigate();

  useEffect(() => {
    if(size?.width >= 890) setMaxHeight('calc(100vh - var(--header-height) - 51px - var(--page-padding) * 3 - 10px - 7px)');
    else if(size?.width < 890 && size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 97px - 10px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 156px - 10px)');
    // comment minus paging?
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = row => {
    navigate({ pathname: 'bonus_add', search: createSearchParams({ bonusId: row?.original?.bonusId }).toString() });
  }

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'bonusId', desc: true }] }},
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

/*
comment
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { Money, PaginationTable } from '../../../all/all_m';
import { TableResize } from '../../../../../components/all';

export function List(props){
  const { data, size } = props;
 

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

  

  

  


  return (
    
  );
}
*/