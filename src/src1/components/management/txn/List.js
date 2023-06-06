import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment'

import { PaginationTable, FooterTable, Empty1, Money } from '../../all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';

export function List(props){
  const { data, excelName, setError, onSearch, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('system_menu.store'), accessor: 'siteName', exLabel:t('system_menu.store'), Footer: t('report.total'), customStyle: { width: 200} },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle: { width: 180}  },
      { Header: t('page.date'), accessor: 'txnDate', exLabel: t('page.date'), customStyle: { width: 80 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
      { Header: t('report.constant'), accessor: 'txnTypeName', exLabel:t('report.constant'), customStyle: { width: 120 }  },
      { Header: <div style={{textAlign: 'right'}}>{t('report.qty1')}</div>, accessor: 'qty', exLabel: t('report.qty1'), customStyle: { width: 50 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.qty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', exLabel: t('order.t_cost'), customStyle: { width: 80 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), customStyle: { width: 80 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'amount', exLabel: t('report.price'), customStyle: { width: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalAmount', 
      exLabel: t('report_receipt.t_total'), customStyle: { width: 120 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: t('report.expireDate'), accessor: 'expireDate', exLabel: t('report.expireDate'), customStyle: { width: 80 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , customStyle: { width: 150} },
      { Header: t('employee.title'), accessor: 'empName', exLabel:t('supplier.title') , customStyle: { width: 120} },
      { Header: t('system.date'), accessor: 'createdDate', exLabel: t('system.date'), customStyle: { width: 80 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  


  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const filterProps = {columns, data, excelName, setError, onSearch , size };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <div  >
      <Header {...filterProps} />
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <>
        <div style={{overflowX: 'scroll'}}>
          <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
            <FooterTable {...tableProps} />
          </div>
        </div>     
        <PaginationTable {...tableProps} />
       </>
      }
    </div>
  );
}