import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy } from 'react-table';

import '../../../css/report.css';
import { Button, PaginationTable, Table, IconDropdown, DynamicMDIcon, Money } from '../../all';

export function List(props){
  const { data } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['totalSalesAmt', 'totalReturnAmt', 'totalDiscAmt', 'totalNetSalesAmt', 'costOfGoods', 'totalProfitAmt']);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const changeColumns = value => {
    let columns = [{ Header: t('page.date'), accessor: 'label' }];
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
    initialState: { pageIndex: 0, pageSize: 25 }}, useSortBy, usePagination);
  const tableProps = { tableInstance };
  const exportProps = { className: 'rp_list_select', text: t('page.export'), disabled: true };
  const columnProps = { value: columns1, setValue: changeColumns, data: t('report_review.columns'), className: 'rp_list_drop',
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