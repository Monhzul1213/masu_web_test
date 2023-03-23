import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy } from 'react-table';

import '../../../css/report.css';
import { ExportExcel } from '../../../helpers';
import { PaginationTable, Table, IconSelect, DynamicMDIcon, Money } from '../../all';

export function List(props){
  const { data, excelName } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['totalSalesAmt', 'totalReturnAmt', 'totalDiscAmt', 'totalNetSalesAmt', 'totalCost',
      'totalProfitAmt', 'taxes']);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const changeColumns = value => {
    let columns = [{ Header: t('report.t_item'), accessor: 'invtName', exLabel: t('report.t_item') }];
    setColumns1(value);
    t('report.column')?.forEach(item => {
      let index = value?.findIndex(val => val === item?.value);
      if(index !== -1){
        let textAlign = item?.align ?? 'right';
        columns.push({
          Header: <div style={{ textAlign }}>{item?.label}</div>, accessor: item?.value,
          exLabel: item?.label,
          Cell: props => {
            return (
              <div style={{ textAlign, paddingRight: 15}}>
                {item?.noformat ? props?.value : <Money value={props?.value} fontSize={14} />}
                {/* {item?.value === 'margin' ? (+(props?.value)?.toFixed(2) + '%') : <Money value={props?.value} fontSize={14} />} */}
              </div>
            )
          }
        });
      }
    });
    setColumns(columns);
  }

  const columnProps = { value: columns1, setValue: changeColumns, data: t('report.column'),
    className: 'rp_list_drop', Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination);
  const tableProps = { tableInstance };

  return (
    <div>
      <div className='rp_list_filter'>
        <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
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