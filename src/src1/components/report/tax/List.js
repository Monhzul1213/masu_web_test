import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, Table , Money} from '../../all/all_m';
import moment from 'moment';


export function List(props){
  const { data} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, ] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: <div >{t('report.site')}</div>, accessor: 'siteName', customStyle: { width: 150 },  },
      { Header: <div >{t('report.date')}</div>, accessor: 'salesDate' , customStyle: { width: 250 },
      Cell: ({ value }) => (<div>{moment(value)?.format('yyyy.MM.DD HH:mm')}</div>)},
      { Header: <div style={{textAlign: 'right'}}>{t('report.total_sales')}</div> , accessor: 'totalSalesAmount',
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header: <div style={{textAlign: 'right'}}>{t('report.refund')}</div>, accessor: 'totalReturnAmount' ,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: <div style={{textAlign: 'right'}}>{t('report.noat')}</div>, accessor: 'totalVatAmount',
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
      { Header:  <div style={{textAlign: 'right'}}>{t('report.nhat')}</div>, accessor: 'totalNHATAmount',
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> },
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