import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Empty1, Money, TableResize } from '../../all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';

export function List1(props){
  const { excelName, setError, onSearch, size, dtlData, isDtl, setIsDtl, setDtlData} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    setColumns([
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('report.siteName'), Footer: t('report.total'), width: 140, minWidth: 80, },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), width: 140, minWidth: 80,  },
      { Header: t('manage.costType'), accessor: 'costTypeName', exLabel:t('manage.costType'), width: 90, minWidth: 80,  },
      { Header: t('manage.costNo'), accessor: 'costNo', exLabel:t('manage.costNo'), width: 90, minWidth: 80,  },
      { Header: t('manage.costDate'), accessor: 'costDate', exLabel: t('manage.costDate'), width: 120, minWidth: 80,
      Cell: ({ value }) => {
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>)
      }
      },
      { Header: t('report.expireDate'), accessor: 'costExpireDate', exLabel: t('report.expireDate'), width: 130, minWidth: 80,
      Cell: ({ value }) => {
        return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>)
      }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.c_title2')}</div>, accessor: 'salesQty', exLabel: t('order.t_qty'), width: 120, minWidth: 70, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', exLabel: t('inventory.t_qty'), width: 90, minWidth: 70,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.qty + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'), width: 110, minWidth: 80,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), width: 150, minWidth: 80,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
        Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'amount', exLabel: t('report.price'),width: 90, minWidth: 80,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalAmount', 
      exLabel: t('report_receipt.t_total'), width: 120, minWidth: 80,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , width: 130, minWidth: 80 }
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

  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);

  const tableInstance = useTable({ columns, data: dtlData, defaultColumn, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 100000, sortBy: [{ id: 'costDate', desc: true }] },}, 
    useSortBy, useBlockLayout, useResizeColumns, usePagination, useRowSelect);

  const tableProps = { tableInstance };
  const filterProps = { columns, data: dtlData, setData: setDtlData, excelName, setError, onSearch , size, isDtl, setIsDtl };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <div  >
      <Header {...filterProps} />
      {!dtlData?.length ? <Empty1 {...emptyProps} /> : 
      <>
        <div style={{overflowX: 'scroll'}}>
          <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
            {<TableResize {...tableProps}/> }
          </div>
        </div>     
       </>
      }
    </div>
  );
}