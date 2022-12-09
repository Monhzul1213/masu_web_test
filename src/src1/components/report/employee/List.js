import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../../../helpers';
import { PaginationTable, Table } from '../../all/all_m';

export function List(props){
  const { data} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, ] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.name'), accessor: 'empName',},
      { Header: <div style={{textAlign: 'center'}}>{t('report.total_sales')}</div>, accessor: 'totalSalesAmt', customStyle: { width: 150 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div> },
      { Header: <div style={{textAlign: 'center'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmt' , customStyle: { width: 150 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div>},
      { Header: <div style={{textAlign: 'center'}}>{t('report.discount')}</div>, accessor: 'totalDiscAmt' , customStyle: { width: 100 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div>},
      { Header: <div style={{textAlign: 'center'}}>{t('report.net_sales')}</div> , accessor: 'totalNetSalesAmt',customStyle: { width: 150 } ,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div> },
      { Header: <div style={{textAlign: 'center'}}>{t('report.receipt')}</div>, accessor: 'receipts',customStyle: { width: 100 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div> },
      { Header:  <div style={{textAlign: 'center'}}>{t('report.ave_sale')}</div>, accessor: 'averageAmt',  customStyle: { width: 150 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div> },
      {
        Header: <div style={{textAlign: 'center'}}>{t('report.signed_up')}</div>, accessor: 'customerQty', customStyle: { width: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>,
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    // setSelected(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'sale.salesNo', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance,  };

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}