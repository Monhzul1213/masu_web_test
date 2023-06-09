import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { PaginationTable, FooterTable, Empty1, Money } from '../../../components/all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';

export function List(props){
  const { data, excelName, setError, onSearch, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [isDtl, setIsDtl] = useState(false);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('report.siteName'), Footer: t('report.total'), customStyle: { width: 180} },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle: { width: 220}  },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode'), customStyle: { width: 120}  },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', exLabel: t('order.t_qty'), customStyle: { width: 150}, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.orderQty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), customStyle: { width: 150}, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.qty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'), customStyle: { width: 150},
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), customStyle: { width: 150},
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
          }
      },
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , customStyle: { width: 150} },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    setColumns1([
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('report.siteName'), Footer: t('report.total'), customStyle: { width: 200} },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle: { width: 180}  },
      { Header: t('manage.costType'), accessor: 'costTypeName', exLabel:t('manage.costType'), customStyle: { width: 120}  },
      { Header: t('manage.costNo'), accessor: 'costNo', exLabel:t('manage.costNo'), customStyle: { width: 120}  },
      { Header: t('manage.costDate'), accessor: 'costDate', exLabel: t('manage.costDate'), customStyle: { width: 80 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
      { Header: t('report.expireDate'), accessor: 'costExpireDate', exLabel: t('report.expireDate'), customStyle: { width: 150 },
      Cell: ({ value }) => {
        return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
      }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', exLabel: t('inventory.t_qty'), 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.qty + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'), 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
        Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
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
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , customStyle: { width: 120} }
      ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 67px )');
    else if(size?.width < 920 && size?.width >= 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 123px )');
    else if(size?.width < 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 160px )');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const tableInstance = useTable({ columns : (!isDtl ? columns : columns1), data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [isDtl ? { id: 'invtName', desc: true } : { id: 'costDate', desc: true }] },}, 
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const filterProps = {columns, data, excelName, setError, onSearch , size, isDtl, setIsDtl };
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