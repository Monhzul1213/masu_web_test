import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, Table , Money} from '../../../components/all/all_m';
import { Header } from './Header';

export function List(props){
  const { data, excelName} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report.discount'), accessor: 'name', exLabel: t('report.discount'), customStyle: { width: 300 },},
      { Header: <div style={{textAlign: 'right'}}>{t('report.disApplied')}</div>, accessor: 'discountsapplied' , 
      exLabel:t('report.disApplied'), customStyle: { width: 200 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('report.disAmt')}</div>, accessor: 'amountdiscounted',
      exLabel: t('report.disAmt'), customStyle: { width: 200 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  


  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
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