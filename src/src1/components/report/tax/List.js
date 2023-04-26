import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, Table , Money} from '../../all/all_m';
import moment from 'moment';
import { Header } from './Header';

export function List(props){
  const { data, excelName} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: <div >{t('report.site')}</div>, accessor: 'siteName', customStyle: { width: 250 }, exLabel: t('report.site')  },
      { Header: <div >{t('report.date')}</div>, accessor: 'salesDate' , customStyle: { width: 150 }, exLabel: t('report.date'), 
      Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)},
      { Header: <div style={{textAlign: 'right'}}>{t('report.total_sales')}</div> , accessor: 'totalSalesAmount', exLabel: t('report.total_sales'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> , customStyle: { width: 150 }},
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmount' , exLabel: t('report.refund'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>, customStyle: { width: 150 },},
      { Header: <div style={{textAlign: 'right'}}>{t('report.noat')}</div>, accessor: 'totalVatAmount', exLabel: t('report.noat'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> , customStyle: { width: 150 },},
      { Header:  <div style={{textAlign: 'right'}}>{t('report.nhat')}</div>, accessor: 'totalNHATAmount', exLabel: t('report.nhat'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>, customStyle: { width: 150 }, },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    // setSelected(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 160px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasTotal: true , total: data?.length };
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