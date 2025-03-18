import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Money, Table, } from '../../all';


export function DetailList(props){
  const { data, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('inventory.title'), accessor: 'invtName', customStyle: { minWidth: 20 }},
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', customStyle: { minWidth: 50 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', customStyle: { minWidth: 50 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 250000 , sortBy: [{ id: 'salesDate', desc: true }]},
  }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
      <div className='table_scroll' id='paging' style={{marginTop: 0, overflow: 'scroll', maxHeight, minWidth : 220}}>
        <Table {...tableProps} />
      </div>
  )
}