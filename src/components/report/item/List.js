import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';

import '../../../css/report.css';
import { PaginationTable, TableResize, Money } from '../../all';
import { Header } from './Header';

export function List(props){
  const { data, excelName, filter, size, getData, date } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['barCode', 'categoryName', 'qty', 'totalSalesAmt', 'totalReturnAmt', 'returnQty', 'totalDiscAmt', 'totalNetSalesAmt', 'totalCost',
      'totalProfitAmt', 'taxes', 'totalVatAmt']);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const changeColumns = value => {
    let columns = [{ Header: t('report.t_item'), accessor: 'invtName', exLabel: t('report.t_item'), width: 140, minWidth: 75 }];
    setColumns1(value);
    t('report.column')?.forEach(item => {
      let index = value?.findIndex(val => val === item?.value);
      if(index !== -1){
        let textAlign = item?.align ?? 'right';
        columns.push({
          Header: <div style={{ textAlign }}>{item?.label}</div>, accessor: item?.value,
          exLabel: item?.label,
          width: 160, minWidth: 120,
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

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const filterProps = { onSearch: getData, size, filter, columns, data1: data, excelName, date,
    value: columns1, setValue: changeColumns, data: t('report.column'), className: 'rp_list_drop' };
  
  return (
    <div>
      <Header {...filterProps} />        
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}