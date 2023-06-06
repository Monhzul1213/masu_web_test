import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { PaginationTable, FooterTable, Empty1, Money } from '../../../components/all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';

export function List(props){
  const { data, excelName, setError, onSearch, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report.siteName'), accessor: 'siteNme', exLabel:t('report.siteName'), Footer: t('report.total'), customStyle: { width: 180} },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle: { width: 180}  },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', exLabel: t('order.t_qty'), 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.orderQty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value ? props.value : 0}</div>,
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
      { Header: t('supplier.title'), accessor: 'vendName', exLabel:t('supplier.title') , customStyle: { width: 120} },
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
          <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
            <FooterTable {...tableProps} />
          </div>
        </div>     
        <PaginationTable {...tableProps} />
       </>
      }
    </div>
  );
}