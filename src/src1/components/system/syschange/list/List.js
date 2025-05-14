import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useNavigate, createSearchParams } from 'react-router-dom';

import { PaginationTable, Table } from '../../../../../components/all';

export function List(props){
  const { data, size  } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      { Header: t('bill.date'), accessor: 'beginDate', customStyle: { minWidth: 80 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },      
      { Header: t('noti.subject'), accessor: 'subject' },
      { Header: t('system.createdDate'), accessor: 'endDate', customStyle: { minWidth: 80 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 107px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 107px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = row => {
    navigate({ pathname: 'syschange_add', search: createSearchParams({ notifcationId: row?.original?.notifcationId}).toString() });
  }
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginDate', desc: true }] } }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick,  hasTotal: true , total: data?.length };

  return (
    <div>
      <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}