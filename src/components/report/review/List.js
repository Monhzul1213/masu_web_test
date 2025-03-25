import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';
import moment from 'moment';

import '../../../css/report.css';
import { IconSelect, DynamicMDIcon, Money, TableRowResize } from '../../all';
import { ExportExcel } from '../../../helpers';

export function List(props){
  const { data, period, excelName } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['totalSalesAmt', 'salesQty', 'totalReturnAmt', 'returnQty', 'totalDiscAmt', 'totalNetSalesAmt', 'totalCashAmount',
      'totalNonCashAmount', 'costOfGoods', 'totalProfitAmt'], period);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, period]);

  const changeColumns = (value, perd) => {
    let isHour = perd === 'H';
    let columns = [
      {
        Header: t(isHour ? 'page.time' : 'page.date'), accessor: 'salesDate',
        width: 100, minWidth: 75, maxWidth: 100,
        exLabel: t(isHour ? 'page.time' : 'page.date'),
        Cell: ({ value }) => {
          return isHour ? (<span>{value}</span>) : (<span>{moment(value)?.format('yyyy.MM.DD')}</span>)
        },
        Footer: t('report.total') + data?.length
      },
      { Header: t('order.site'), accessor: 'siteName', exLabel: t('order.site'), width: 135, minWidth: 90 }
    ];
    setColumns1(value);
    t('report_review.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={{textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value,
          width: 120, minWidth: 90,
          exLabel: item?.label,
          Cell: props => (
            <div style={{textAlign: 'right', paddingRight: 15}}>
              {item?.value === 'margin' ? (+(props?.value)?.toFixed(2) + '%') :
               item?.value === 'salesQty' ? props?.value :
               item?.value === 'returnQty' ? props?.value : <Money value={props?.value} fontSize={14} />}
            </div>),
          Footer: info => {
            let totalSalesAmt = info.data.reduce((sum, { totalSalesAmt }) => sum += totalSalesAmt, 0);
            let totalReturnAmt = info.data.reduce((sum, { totalReturnAmt }) => sum += totalReturnAmt, 0);
            let totalDiscAmt = info.data.reduce((sum, { totalDiscAmt }) => sum += totalDiscAmt, 0);
            let totalNetSalesAmt = info.data.reduce((sum, { totalNetSalesAmt }) => sum += totalNetSalesAmt, 0);
            let totalCashAmount = info.data.reduce((sum, { totalCashAmount }) => sum += totalCashAmount, 0);
            let totalNonCashAmount = info.data.reduce((sum, { totalNonCashAmount }) => sum += totalNonCashAmount, 0);
            let costOfGoods = info.data.reduce((sum, { costOfGoods }) => sum += costOfGoods, 0);
            let totalProfitAmt = info.data.reduce((sum, { totalProfitAmt }) => sum += totalProfitAmt, 0);
            let taxes = info.data.reduce((sum, { taxes }) => sum += taxes, 0);
            let salesQty = info.data.reduce((sum, { salesQty }) => sum += salesQty, 0);
            let returnQty = info.data.reduce((sum, { returnQty }) => sum += returnQty, 0);
            return <> 
              <div style={{textAlign: 'right', paddingRight: 15}}>
                {item?.value === 'totalSalesAmt' ? <Money value= {totalSalesAmt}/> : 
                  item?.value === 'totalReturnAmt' ? <Money value= {totalReturnAmt}/> :
                  item?.value === 'totalDiscAmt' ? <Money value= {totalDiscAmt}/> :
                  item?.value === 'totalNetSalesAmt' ? <Money value= {totalNetSalesAmt}/> :
                  item?.value === 'totalCashAmount' ? <Money value= {totalCashAmount}/> :
                  item?.value === 'totalNonCashAmount' ? <Money value= {totalNonCashAmount}/> :
                  item?.value === 'costOfGoods' ? <Money value= {costOfGoods}/> :
                  item?.value === 'totalProfitAmt' ? <Money value= {totalProfitAmt}/> :
                  item?.value === 'taxes' ? <Money value= {taxes}/> :
                  item?.value === 'salesQty' ? salesQty : item?.value === 'returnQty' ? returnQty : ''}
              </div></>
            }
        });
      }
    });
    setColumns(columns);
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, hasFooter: true };
  const columnProps = { value: columns1, setValue: changeColumns, data: t('report_review.columns'), className: 'rp_list_drop',
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };

  return (
    <div>
      <div className='rp_list_filter'>
        <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
        <IconSelect {...columnProps} />
      </div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' className='table_scroll' style={{overflow: 'scroll', maxHeight, minWidth: 720}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
    </div>
  );
}