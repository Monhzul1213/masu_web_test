import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, Table , Money} from '../../all/all_m';
import { Header } from './Header';

export function List(props){
  const { data, excelName} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, ] = useState('300px');

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




  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance,  };
  const filterProps = {columns, data, excelName };

  return (
    <div>
      <Header {...filterProps} />
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}