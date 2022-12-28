import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import {  FooterTable, Money } from '../../all/all_m';
import { formatNumber } from '../../../../helpers';

export function List(props){
  const { data} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report.pay_type'), accessor: 'paymentTypeName', Footer: t('report.total')}, 
      { Header: <div style={{textAlign: 'right'}}>{t('report.pay_trans')}</div> , accessor: 'paymentTranscation', customStyle: { width: 200 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value} </div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.paymentTranscation + sum, 0),
          [info.rows]  )
        return <> <div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
       } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.pay_amt')}</div>, accessor: 'paymentAmount', customStyle: { width: 200 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.paymentAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={15} /></div></>
       }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund_trans')}</div>, accessor: 'refundTransaction' , customStyle: { width: 120 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.refundTransaction + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{total}</div></>
       } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund_amt')}</div>, accessor: 'refundAmount', customStyle: { width: 200 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> ,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.refundAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={15} /></div> </>
       }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.net_sales')}</div>, accessor: 'netAmount', customStyle: { width: 200 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div> , 
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.netAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
       } },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  


  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns,data,  autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <FooterTable {...tableProps} />
        </div>
      </div>
    </div>
  );
}