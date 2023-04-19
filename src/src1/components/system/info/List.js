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
        Header: <div style={{textAlign: 'right'}}>{t('system.id')}</div>, accessor: 'merchantID',
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      { Header: t('tax.customer'), accessor: 'customer' , customStyle: { width: 300 }},
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.site_qty')}</div>, accessor: 'siteQty', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.pos_qty')}</div>, accessor: 'terminalQty', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.emp_qty')}</div>, accessor: 'empQty', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_qty')}</div>, accessor: 'subQty', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sub_amount')}</div>, accessor: 'subAmount', customStyle: { width: 80 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sales_amt')}</div>, accessor: 'totalSales', customStyle: { width: 80 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.sales_qty')}</div>, accessor: 'salesQty', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
      { Header: t('system.noat'), accessor: 'useNuatus' ,
      Cell: props => (<div >{props?.value === 'Y' ? t('page.yes'): t('page.no')}</div>)
      },
      { Header: t('system.date'), accessor: 'createdDate', customStyle: { minWidth: 80 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('system.partner')}</div>, accessor: 'partnerCode', customStyle: { width: 80 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>)
      },
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
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'merchantID', desc: true }] }}, useSortBy, usePagination, useRowSelect);
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