import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { PaginationTable, Table , Money } from '../../../../components/all';
import { Header } from './Header';

export function List(props){
  const { data, excelName, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight ] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.name'), accessor: 'empName', exLabel: t('report.name') },
      { Header: <div style={{textAlign: 'right'}}>{t('report.total_sales')}</div>, accessor: 'totalSalesAmt', customStyle: { width: 150 }, 
      exLabel: t('report.total_sales') ,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmt' , customStyle: { width: 150 }, 
      exLabel: t('report.refund'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: <div style={{textAlign: 'right'}}>{t('report.net_sales')}</div> , accessor: 'totalNetSalesAmt',customStyle: { width: 150 } , 
      exLabel: t('report.net_sales'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.discount')}</div>, accessor: 'totalDiscAmt' , customStyle: { width: 100 }, 
      exLabel: t('report.discount'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: <div style={{textAlign: 'right'}}>{t('report.receipt')}</div>, accessor: 'receipts',customStyle: { width: 130 },
      exLabel: t('report.receipt'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0} </div> },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.ave_sale')}</div>, accessor: 'averageAmt',  customStyle: { width: 150 }, 
      exLabel: t('report.ave_sale'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.customer')}</div>, accessor: 'customerQty', customStyle: { width: 120 },
       exLabel: t('report.customer'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value ? props.value : 0}</div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 90px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 70px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length  };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}