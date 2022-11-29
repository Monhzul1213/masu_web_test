import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { formatNumber } from '../../../helpers';
import { PaginationTable, Table } from '../../all';

export function List(props){
  const { data } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report_receipt.t_no'), accessor: 'sale.salesNo' },
      {
        Header: t('page.date'), accessor: 'sale.salesDate',
        Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD HH:mm')}</div>)
      },
      { Header: t('time.t_site'), accessor: 'sale.siteName' },
      { Header: t('time.t_emp'), accessor: 'sale.empName' },
      { Header: t('report_receipt.t_user'), accessor: 'sale.custName' },
      { Header: t('report_receipt.t_type'), accessor: 'sale.typeName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'sale.totalSalesAmount', customStyle: { width: 100 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onRowClick = row => {
    console.log(row);
  }

  const maxHeight = '400px';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, initialState: { pageIndex: 0, pageSize: 25 }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}