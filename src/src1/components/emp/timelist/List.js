import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, Table } from '../../../components/all/all_m';

export function List(props){
  const { data} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('time.t_emp'), accessor: 'empName',
    },
      { Header: t('time.t_site'), accessor: 'siteName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('time.t_total')}</div>, accessor: 'totalHours',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  


  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

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