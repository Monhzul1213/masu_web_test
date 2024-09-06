import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment'

import { PaginationTable, Empty1, Money, TableRowResize } from '../../../../components/all';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';

export function List(props){
  const { data, setData, excelName, setError, onSearch, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('manage.txnId'), accessor: 'txnCostId', exLabel:t('menu.inventory'), Footer: t('report.total'), width: 110, minWidth: 90  },
      { Header: t('manage.t_no'), accessor: 'txnNo', exLabel:t('menu.inventory'), width: 130, minWidth: 110  },
      { Header: t('system_menu.store'), accessor: 'siteName', exLabel:t('system_menu.store'), width: 130, minWidth: 110 },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), width: 130, minWidth: 110  },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode'), width: 110, minWidth: 80 },
      { Header: t('page.date'), accessor: 'txnDate', exLabel: t('page.date'), width: 90, minWidth: 80,
      Cell: ({ value }) => {
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>)
      }
      },
      { Header: t('manage.costType'), accessor: 'txnTypeName', exLabel:t('report.constant'), width: 90, minWidth: 80  },
      { Header: <div style={{textAlign: 'right'}}>{t('report.qty1')}</div>, accessor: 'signQty', exLabel: t('report.qty1'), width: 90, minWidth: 60,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.signQty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_cost')}</div>, accessor: 'cost', exLabel: t('order.t_cost'), width: 80, minWidth: 70, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), width: 150, minWidth: 120,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'amount', exLabel: t('report.price'), width: 100, minWidth: 80,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalAmount', 
      exLabel: t('report_receipt.t_total'), width: 100, minWidth: 80,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: t('report.expireDate'), accessor: 'expireDate', exLabel: t('report.expireDate'), width: 130, minWidth: 130,
      Cell: ({ value }) => {
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>)
      }
      },
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , width: 140, minWidth: 110 },
      { Header: t('employee.title'), accessor: 'empName', exLabel:t('supplier.title') , width: 120, minWidth: 110 },
      { Header: t('system.date'), accessor: 'createdDate', exLabel: t('system.date'), width: 130, minWidth: 110 ,
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 67px )');
    else if(size?.width < 920 && size?.width >= 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 230px )');
    else if(size?.width < 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 263px )');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'createdDate', desc: true }] },
      }, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, hasTotal: true, total: data?.length, hasFooter: true };
  const filterProps = {columns, data, setData, excelName, setError, onSearch , size,  };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <div  >
      <Header {...filterProps} />
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <>
          <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720}}>
            <TableRowResize {...tableProps} />
          </div>    
        <PaginationTable {...tableProps} />
       </>
      }
    </div>
  );
}