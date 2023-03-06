import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy } from 'react-table';
import moment from 'moment';

import '../../../css/report.css';
import { Button, PaginationTable, Table, IconSelect, DynamicMDIcon, Money } from '../../all';

export function List(props){
  const { data, period } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['totalSalesAmt', 'totalReturnAmt', 'totalDiscAmt', 'totalNetSalesAmt', 'totalCashAmount',
      'totalNonCashAmount', 'costOfGoods', 'totalProfitAmt'], period);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, period]);

  const changeColumns = (value, perd) => {
    let isHour = perd === 'H';
    let columns = [
      {
        Header: t(isHour ? 'page.time' : 'page.date'), accessor: 'salesDate',
        Cell: ({ value }) => {
          return isHour ? (<div>{value}</div>) : (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
        }
      },
      { Header: t('order.site'), accessor: 'siteName' }
    ];
    setColumns1(value);
    t('report_review.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={{textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value,
          Cell: props => (
            <div style={{textAlign: 'right', paddingRight: 15}}>
              {item?.value === 'margin' ? (+(props?.value)?.toFixed(2) + '%') : <Money value={props?.value} fontSize={14} />}
            </div>)
        });
      }
    });
    setColumns(columns);
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination);
  const tableProps = { tableInstance };
  const exportProps = { className: 'rp_list_select', text: t('page.export'), disabled: true };
  const columnProps = { value: columns1, setValue: changeColumns, data: t('report_review.columns'), className: 'rp_list_drop',
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };

  return (
    <div>
      <div className='rp_list_filter'>
        <Button {...exportProps} />
        <IconSelect {...columnProps} />
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