import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy } from 'react-table';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';
import { Button, PaginationTable, Table, IconDropdown, DynamicMDIcon } from '../../all';

export function List(props){
  const { data, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

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
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 117px - 38px - 39px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 117px - 38px - 39px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination);
  const tableProps = { tableInstance };
  const exportProps = { className: 'rp_list_select', text: t('page.export'), disabled: true };
  const columnProps = { value: columns1, setValue: setColumns1, data: t('report_review.columns'), className: 'rp_list_drop',
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };

  return (
    <div>
      <div className='rp_list_filter'>
        <Button {...exportProps} />
        <IconDropdown {...columnProps} />
      </div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}