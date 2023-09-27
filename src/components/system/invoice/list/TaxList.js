import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../all';
import { FooterTable } from '../../../../src1/components/all/all_m';

export function TaxList(props){
  const { data, size , setAmt} = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setColumns([
      { id: 'Name', Header: <div style={{textAlign: 'center' }}>{t('page.name')}</div>, accessor: d => { return d.EmpName ? d.EmpName : d.Name }, noSort: true, isBtn: true},
      { Header: <div style={{textAlign: 'center' }}>{t('system.service_name')}</div>, accessor: 'SubscriptionName', noSort: true, isBtn: true,
        Cell: ({ value }) => (<div style={{ paddingLeft: 5}}>{value}</div>),    },
      { Header: <div style={{textAlign: 'center' }}>{t('invoice.time')}</div>, accessor: 'SubscriptionTimeName', Footer: <div style={{textAlign: 'right' }}>{t('report.total')}</div>, noSort: true, isBtn: true },
      { Header: <div style={{textAlign: 'center',  paddingRight: 15}}>{t('invoice.amount')}</div>, accessor: 'Amount', noSort: true, isBtn: true,
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>),
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.Amount + sum, 0),
            [info.rows]  )
            setAmt(total)
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>}},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'invoiceDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
      <div className='table_scroll'>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 520}}>
          <FooterTable {...tableProps} />
        </div>
      </div>
  );
}