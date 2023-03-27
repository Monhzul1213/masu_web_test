import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { PaginationTable, Money , Table} from '../all/all_m';
import moment from 'moment';


export function TranList(props){
  const { data, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { Header: t('page.date'), accessor: 'txnLists.salesDate', 
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      } },
      { Header: t('report_receipt.dr_site'), accessor: 'txnLists.siteId',
        Cell: props => <div >{props.value}</div>},
      { Header: t('system.emp_qty'), accessor: 'txnLists.custName',
        Cell: props => <div >{props.value}</div>},
      { Header: t('discount.type'), accessor: 'txnType',
        Cell: props => <div >{props.value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'txnAmount',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

 

  const maxHeight = size?.width > 780
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 25 },
  }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div >
      <div style={{overflowX: 'scroll'}} >
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 720}}>
              <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}