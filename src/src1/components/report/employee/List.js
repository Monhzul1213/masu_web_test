import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';

import { formatNumber } from '../../../../helpers';
import { PaginationTable, Table } from '../../all/all_m';
// import { Drawer } from '../../../../components/report/receipt/Drawer';

export function List(props){
  const { data, size, loading, tab } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  // const [ setSelected] = useState(null);

  useEffect(() => {
    setColumns([
      { Header: t('report_receipt.t_no'), accessor: 'sale.salesNo' },
      {
        Header: t('page.date'), accessor: 'sale.createdDate',
        Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD HH:mm')}</div>)
      },
      { Header: t('time.t_site'), accessor: 'sale.siteName' },
      { Header: t('time.t_emp'), accessor: 'sale.cashierName' },
      { Header: t('report_receipt.t_user'), accessor: 'sale.custName' },
      { Header: t('report_receipt.t_type'), accessor: 'sale.salesTypeName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'sale.totalSalesAmount', customStyle: { width: 100 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props?.value)}</div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 86px - 38px - 39px)');
    else if(size?.width < 920 && size?.width >= 520)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 86px - 38px - 39px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 60px - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    // setSelected(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tab]);

  // const onRowClick = row => {
  //   setSelected(row?.original);
  // }

  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance,  };
  // const drawerProps = { selected, setSelected };

  return (
    <div>
      {/* <Drawer {...drawerProps} /> */}
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}