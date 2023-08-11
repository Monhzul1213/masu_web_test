import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { Money, PaginationTable, Table } from '../../all/all_m';
import moment from 'moment';

export function List(props){
  const { data, size } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setColumns([
      {
        Header: <div>{t('system.partnerCode')}</div>, accessor: 'partnerCode', customStyle: {width: 120},
        Cell: props => (<div >{props?.value}</div>)
      },
      { Header: t('system.partner_name'), accessor: 'partnerName' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.merchant')}</div>, accessor: 'merchant_Count', customStyle: {width: 150}, 
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_qty')}</div>, accessor: 'subscription_Count', customStyle: {width: 150},
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_amount')}</div>, accessor: 'subscription_Amount', customStyle: {width: 150},
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.partner_amt')}</div>, accessor: 'partner_Amount', customStyle: {width: 150},
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      { Header: <div style={{textAlign: 'right'}}>{t('system.createdDate')}</div>, accessor: 'createdDate', customStyle: {width: 150},
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}>{moment(value).format('yyyy.MM.DD')}</div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 57px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 10px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'createdDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length };

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